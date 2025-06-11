package com.m4gi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.WeatherDTO;

import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Slf4j
@Service
public class WeatherServiceImpl implements WeatherService {

    @Value("${weather.api.key}")
    private String apiKey;

    @Value("${weather.api.url}")
    private String apiUrl;

    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;

    public WeatherServiceImpl() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public List<WeatherDTO> getWeatherForPeriod(double latitude, double longitude, LocalDate startDate,
            LocalDate endDate) {
        List<WeatherDTO> weatherList = new ArrayList<>();

        try {
            // 현재 날씨 및 5일 예보 API 호출
            String forecastUrl = String.format("%s/forecast?lat=%f&lon=%f&appid=%s&units=metric&lang=kr",
                    apiUrl, latitude, longitude, apiKey);

            log.info("날씨 API 호출: {}", forecastUrl.replaceAll("appid=[^&]*", "appid=***"));

            String response = restTemplate.getForObject(forecastUrl, String.class);
            JsonNode jsonResponse = objectMapper.readTree(response);

            // 5일 예보 데이터 파싱
            JsonNode forecastList = jsonResponse.get("list");
            if (forecastList != null && forecastList.isArray()) {
                for (JsonNode forecast : forecastList) {
                    LocalDate forecastDate = LocalDate.ofInstant(
                            java.time.Instant.ofEpochSecond(forecast.get("dt").asLong()),
                            ZoneId.systemDefault());

                    // 요청한 기간 내의 날씨만 포함
                    if (!forecastDate.isBefore(startDate) && !forecastDate.isAfter(endDate)) {
                        WeatherDTO weatherInfo = parseWeatherData(forecast, forecastDate);
                        weatherList.add(weatherInfo);
                    }
                }
            }

            // 중복 날짜 제거 및 일별 평균 계산
            weatherList = aggregateWeatherByDate(weatherList);

        } catch (Exception e) {
            log.error("날씨 정보 조회 실패: {}", e.getMessage());
        }

        return weatherList;
    }

    @Override
    public List<WeatherDTO> getWeatherByAddress(String address, LocalDate startDate, LocalDate endDate) {
        try {
            // 한국 주소를 영문으로 변환하여 검색 성공률 향상
            String searchQuery = convertKoreanAddressToEnglish(address);

            String geocodeUrl = String.format("http://api.openweathermap.org/geo/1.0/direct?q=%s&limit=5&appid=%s",
                    java.net.URLEncoder.encode(searchQuery, "UTF-8"), apiKey);

            log.info("Geocoding API 호출: {} (검색어: {})", geocodeUrl.replaceAll("appid=[^&]*", "appid=***"), searchQuery);

            String response = restTemplate.getForObject(geocodeUrl, String.class);
            JsonNode jsonResponse = objectMapper.readTree(response);

            // 디버깅용 API 응답 로깅
            log.info("Geocoding API 응답: {}", response);

            if (jsonResponse.isArray() && jsonResponse.size() > 0) {
                // 한국 결과 우선 선택
                JsonNode selectedLocation = null;
                for (JsonNode location : jsonResponse) {
                    String country = location.path("country").asText("");
                    if ("KR".equals(country) || "Korea".equalsIgnoreCase(country)) {
                        selectedLocation = location;
                        break;
                    }
                }

                // 한국 결과가 없으면 첫 번째 결과 사용
                if (selectedLocation == null) {
                    selectedLocation = jsonResponse.get(0);
                }

                double latitude = selectedLocation.get("lat").asDouble();
                double longitude = selectedLocation.get("lon").asDouble();
                String foundName = selectedLocation.path("name").asText("");
                String foundCountry = selectedLocation.path("country").asText("");

                log.info("주소 '{}' -> 좌표: lat={}, lon={} (발견: {}, {})",
                        new Object[] { address, latitude, longitude, foundName, foundCountry });

                return getWeatherForPeriod(latitude, longitude, startDate, endDate);
            } else {
                log.warn("주소를 찾을 수 없습니다: {} (검색어: {})", address, searchQuery);

                // 대체 검색 시도
                return tryAlternativeSearch(address, startDate, endDate);
            }

        } catch (Exception e) {
            log.error("주소 기반 날씨 정보 조회 실패: {}", e.getMessage());
            return new ArrayList<>();
        }
    }

    /**
     * 한국 주소를 영문으로 변환하여 검색 성공률 향상
     */
    private String convertKoreanAddressToEnglish(String koreanAddress) {
        if (koreanAddress == null)
            return "";

        String original = koreanAddress.toLowerCase();

        // 제주 관련 특별 처리 - 여러 검색어 시도
        if (original.contains("제주")) {
            return "Jeju-si, Jeju-do, South Korea";
        }

        // 주요 도시 매핑
        if (original.contains("서울"))
            return "Seoul, South Korea";
        if (original.contains("부산"))
            return "Busan, South Korea";
        if (original.contains("대구"))
            return "Daegu, South Korea";
        if (original.contains("인천"))
            return "Incheon, South Korea";
        if (original.contains("광주"))
            return "Gwangju, South Korea";
        if (original.contains("대전"))
            return "Daejeon, South Korea";
        if (original.contains("울산"))
            return "Ulsan, South Korea";
        if (original.contains("세종"))
            return "Sejong, South Korea";

        // 도 단위 지역
        if (original.contains("강원"))
            return "Gangwon, South Korea";
        if (original.contains("경기"))
            return "Gyeonggi, South Korea";
        if (original.contains("충청북"))
            return "Chungcheongbuk, South Korea";
        if (original.contains("충청남"))
            return "Chungcheongnam, South Korea";
        if (original.contains("전라북"))
            return "Jeollabuk, South Korea";
        if (original.contains("전라남"))
            return "Jeollanam, South Korea";
        if (original.contains("경상북"))
            return "Gyeongsangbuk, South Korea";
        if (original.contains("경상남"))
            return "Gyeongsangnam, South Korea";

        // 기본값
        return "South Korea";
    }

    /**
     * 대체 검색 방법 시도 - 모든 도시 지원
     */
    private List<WeatherDTO> tryAlternativeSearch(String originalAddress, LocalDate startDate, LocalDate endDate) {
        String original = originalAddress.toLowerCase();
        String[] alternativeQueries = {};

        // 도시별 대체 검색어 설정
        if (original.contains("제주")) {
            alternativeQueries = new String[] {
                    "Jeju Island, Korea", "Jeju City, Korea", "Jeju, Korea", "Jeju Island", "33.5,126.5"
            };
        } else if (original.contains("대전")) {
            alternativeQueries = new String[] {
                    "Daejeon, Korea", "Daejeon City, Korea", "Daejeon", "36.3504,127.3845"
            };
        } else if (original.contains("서울")) {
            alternativeQueries = new String[] {
                    "Seoul, Korea", "Seoul City, Korea", "Seoul", "37.5665,126.9780"
            };
        } else if (original.contains("부산")) {
            alternativeQueries = new String[] {
                    "Busan, Korea", "Busan City, Korea", "Busan", "35.1796,129.0756"
            };
        } else if (original.contains("대구")) {
            alternativeQueries = new String[] {
                    "Daegu, Korea", "Daegu City, Korea", "Daegu", "35.8714,128.6014"
            };
        } else if (original.contains("인천")) {
            alternativeQueries = new String[] {
                    "Incheon, Korea", "Incheon City, Korea", "Incheon", "37.4563,126.7052"
            };
        } else if (original.contains("광주")) {
            alternativeQueries = new String[] {
                    "Gwangju, Korea", "Gwangju City, Korea", "Gwangju", "35.1595,126.8526"
            };
        } else if (original.contains("울산")) {
            alternativeQueries = new String[] {
                    "Ulsan, Korea", "Ulsan City, Korea", "Ulsan", "35.5384,129.3114"
            };
        } else {
            // 일반적인 대체 검색
            alternativeQueries = new String[] {
                    "Korea", "South Korea", "37.5665,126.9780" // 서울 좌표를 기본값으로
            };
        }

        for (String query : alternativeQueries) {
            try {
                log.info("대체 검색 시도: {}", query);

                // 좌표인 경우 직접 사용
                if (query.contains(",") && query.matches(".*\\d+\\.\\d+,\\d+\\.\\d+.*")) {
                    String[] coords = query.split(",");
                    double lat = Double.parseDouble(coords[0]);
                    double lon = Double.parseDouble(coords[1]);
                    log.info("좌표 직접 사용: lat=" + lat + ", lon=" + lon);
                    return getWeatherForPeriod(lat, lon, startDate, endDate);
                }

                // 일반 검색어인 경우
                String geocodeUrl = String.format(
                        "http://api.openweathermap.org/geo/1.0/direct?q=%s&limit=5&appid=%s",
                        java.net.URLEncoder.encode(query, "UTF-8"), apiKey);

                String response = restTemplate.getForObject(geocodeUrl, String.class);
                JsonNode jsonResponse = objectMapper.readTree(response);

                if (jsonResponse.isArray() && jsonResponse.size() > 0) {
                    JsonNode location = jsonResponse.get(0);
                    double latitude = location.get("lat").asDouble();
                    double longitude = location.get("lon").asDouble();

                    log.info("대체 검색 성공: " + query + " -> lat=" + latitude + ", lon=" + longitude);
                    return getWeatherForPeriod(latitude, longitude, startDate, endDate);
                }
            } catch (Exception e) {
                log.warn("대체 검색 '{}' 실패: {}", query, e.getMessage());
            }
        }

        return new ArrayList<>();
    }

    private WeatherDTO parseWeatherData(JsonNode forecast, LocalDate date) {
        JsonNode main = forecast.get("main");
        JsonNode weather = forecast.get("weather").get(0);
        JsonNode wind = forecast.get("wind");

        return WeatherDTO.builder()
                .date(date)
                .temperature(main.get("temp").asDouble())
                .temperatureMin(main.get("temp_min").asDouble())
                .temperatureMax(main.get("temp_max").asDouble())
                .weatherMain(weather.get("main").asText())
                .weatherDescription(weather.get("description").asText())
                .humidity(main.get("humidity").asDouble())
                .windSpeed(wind != null ? wind.get("speed").asDouble() : 0.0)
                .rainProbability(forecast.has("pop") ? forecast.get("pop").asDouble() * 100 : 0.0)
                .build();
    }

    private List<WeatherDTO> aggregateWeatherByDate(List<WeatherDTO> weatherList) {
        // 날짜별로 그룹화하고 평균값 계산
        List<WeatherDTO> aggregated = new ArrayList<>();

        weatherList.stream()
                .collect(java.util.stream.Collectors.groupingBy(WeatherDTO::getDate))
                .forEach((date, dayWeatherList) -> {
                    if (!dayWeatherList.isEmpty()) {
                        WeatherDTO first = dayWeatherList.get(0);

                        double avgTemp = dayWeatherList.stream().mapToDouble(WeatherDTO::getTemperature).average()
                                .orElse(0.0);
                        double minTemp = dayWeatherList.stream().mapToDouble(WeatherDTO::getTemperatureMin).min()
                                .orElse(0.0);
                        double maxTemp = dayWeatherList.stream().mapToDouble(WeatherDTO::getTemperatureMax).max()
                                .orElse(0.0);
                        double avgHumidity = dayWeatherList.stream().mapToDouble(WeatherDTO::getHumidity).average()
                                .orElse(0.0);
                        double avgWindSpeed = dayWeatherList.stream().mapToDouble(WeatherDTO::getWindSpeed).average()
                                .orElse(0.0);
                        double maxRainProb = dayWeatherList.stream().mapToDouble(WeatherDTO::getRainProbability).max()
                                .orElse(0.0);

                        WeatherDTO aggregatedWeather = WeatherDTO.builder()
                                .date(date)
                                .temperature(Math.round(avgTemp * 10.0) / 10.0)
                                .temperatureMin(Math.round(minTemp * 10.0) / 10.0)
                                .temperatureMax(Math.round(maxTemp * 10.0) / 10.0)
                                .weatherMain(first.getWeatherMain())
                                .weatherDescription(first.getWeatherDescription())
                                .humidity(Math.round(avgHumidity))
                                .windSpeed(Math.round(avgWindSpeed * 10.0) / 10.0)
                                .rainProbability(Math.round(maxRainProb))
                                .build();

                        aggregated.add(aggregatedWeather);
                    }
                });

        // 날짜 순으로 정렬
        aggregated.sort((a, b) -> a.getDate().compareTo(b.getDate()));

        return aggregated;
    }
}