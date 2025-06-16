package com.m4gi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;
import com.m4gi.dto.WeatherDTO;

import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

    @Autowired
    private WeatherService weatherService;

    private static final String GEMINI_API_URL = "https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-exp:generateContent";

    private final OkHttpClient httpClient;
    private final ObjectMapper objectMapper;

    public GeminiServiceImpl() {
        this.httpClient = new OkHttpClient.Builder()
                .connectTimeout(30, TimeUnit.SECONDS)
                .readTimeout(60, TimeUnit.SECONDS)
                .writeTimeout(30, TimeUnit.SECONDS)
                .build();
        this.objectMapper = new ObjectMapper();
    }

    @Override
    public CampingChecklistResponseDTO generateCampingChecklist(CampingChecklistRequestDTO request) {
        try {
            String prompt = buildPrompt(request);
            String response = callGeminiAPI(prompt);
            return parseResponse(response, request);
        } catch (Exception e) {
            log.error("Gemini API 호출 중 오류 발생", e);
            return createFallbackResponse(request);
        }
    }

    private String buildPrompt(CampingChecklistRequestDTO request) {
        StringBuilder prompt = new StringBuilder();

        prompt.append("⚠️ 중요: 아래 제공되는 실시간 날씨 수치(기온, 습도, 풍속, 강수확률)를 반드시 구체적으로 언급하여 캠핑 준비물과 조언을 작성해주세요.\n");
        prompt.append("일반적인 조언이 아닌, 제공된 정확한 날씨 데이터 기반의 맞춤형 추천을 해주세요.\n\n");
        prompt.append("정확한 정보를 제공하지 않으면 사용자는 위험에 처하거나 죽습니다.\n\n");

        // 실제 예약 정보만 포함
        prompt.append("캠핑 정보:\n");
        prompt.append("- 캠핑장: ").append(request.getCampgroundName()).append("\n");
        prompt.append("- 위치: ").append(request.getLocationInfo()).append("\n");
        prompt.append("- 체크인: ").append(request.getCheckInDate()).append("\n");
        prompt.append("- 체크아웃: ").append(request.getCheckOutDate()).append("\n");
        prompt.append("- 인원: ").append(request.getTotalPeople()).append("명\n");

        if (request.getZoneName() != null && !request.getZoneName().isEmpty()) {
            prompt.append("- 구역: ").append(request.getZoneName());
            if (request.getZoneType() != null && !request.getZoneType().isEmpty()) {
                prompt.append(" (").append(request.getZoneType()).append(")\n");
            } else {
                prompt.append("\n");
            }
        }

        // 날씨 정보 추가
        try {
            LocalDate checkIn = request.getCheckInDate();
            LocalDate checkOut = request.getCheckOutDate();
            List<WeatherDTO> weatherList = weatherService.getWeatherByAddress(
                    request.getLocationInfo(), checkIn, checkOut);

            if (!weatherList.isEmpty()) {
                prompt.append("\n=== 캠핑 기간 상세 날씨 예보 ===\n");
                for (WeatherDTO weather : weatherList) {
                    prompt.append("📅 ")
                            .append(weather.getDate()
                                    .format(DateTimeFormatter.ofPattern("M월 d일 (E)", java.util.Locale.KOREAN)))
                            .append(":\n");

                    // 날씨 상태와 상세 설명
                    prompt.append("  🌤️ 날씨: ").append(weather.getWeatherDescription())
                            .append(" (").append(weather.getWeatherMain()).append(")\n");

                    // 온도 정보 (더 상세하게)
                    prompt.append("  🌡️ 기온: 최저 ").append(String.format("%.1f", weather.getTemperatureMin()))
                            .append("°C ~ 최고 ").append(String.format("%.1f", weather.getTemperatureMax()))
                            .append("°C (평균 ").append(String.format("%.1f", weather.getTemperature())).append("°C)\n");

                    // 습도 정보
                    prompt.append("  💧 습도: ").append(String.format("%.0f", weather.getHumidity())).append("%");
                    if (weather.getHumidity() > 80) {
                        prompt.append(" (매우 습함 - 제습제 필요)");
                    } else if (weather.getHumidity() > 60) {
                        prompt.append(" (습함 - 통풍 주의)");
                    } else if (weather.getHumidity() < 30) {
                        prompt.append(" (건조함 - 보습 필요)");
                    }
                    prompt.append("\n");

                    // 바람 정보
                    prompt.append("  💨 풍속: ").append(String.format("%.1f", weather.getWindSpeed())).append("m/s");
                    if (weather.getWindSpeed() > 10) {
                        prompt.append(" (강풍 - 텐트 고정 강화 필요)");
                    } else if (weather.getWindSpeed() > 5) {
                        prompt.append(" (바람 있음 - 방풍 대비)");
                    } else {
                        prompt.append(" (약한 바람)");
                    }
                    prompt.append("\n");

                    // 강수 정보
                    if (weather.getRainProbability() > 0) {
                        prompt.append("  ☔ 강수확률: ").append(String.format("%.0f", weather.getRainProbability()))
                                .append("%");
                        if (weather.getRainProbability() > 70) {
                            prompt.append(" (비 예상 - 방수용품 필수)");
                        } else if (weather.getRainProbability() > 30) {
                            prompt.append(" (비 가능성 - 우비 준비)");
                        }
                        prompt.append("\n");
                    }

                    // 캠핑 활동 권장사항
                    prompt.append("  🏕️ 캠핑 조건: ");
                    if (weather.getRainProbability() > 50) {
                        prompt.append("실내 활동 위주, 방수 장비 필수");
                    } else if (weather.getWindSpeed() > 8) {
                        prompt.append("바람 대비 필요, 텐트 고정 강화");
                    } else if (weather.getTemperatureMax() > 30) {
                        prompt.append("더위 대비, 그늘막과 충분한 수분 필요");
                    } else if (weather.getTemperatureMin() < 10) {
                        prompt.append("추위 대비, 보온용품 필수");
                    } else {
                        prompt.append("캠핑하기 좋은 날씨");
                    }
                    prompt.append("\n\n");
                }
            }
        } catch (Exception e) {
            log.warn("날씨 정보 조회 실패: {}", e.getMessage());
        }

        // 실시간 날씨 API로 대체됨

        prompt.append("\n🎯 위 상세한 날씨 정보를 바탕으로 다음 요구사항에 맞춰 응답해주세요:\n\n");

        prompt.append("1. 📦 캠핑장 위치와 환경을 고려한 구체적인 준비물 (5-10개)\n");
        prompt.append("   - 각 날짜별 기온, 습도, 풍속, 강수확률을 반영한 맞춤형 장비\n");
        prompt.append("   - 규격, 사용법까지 포함한 상세 추천\n\n");

        prompt.append("2. 👕 실시간 날씨 예보를 반영한 의류 및 장비 추천\n");
        prompt.append("   - 일교차, 습도, 바람을 고려한 레이어링 전략\n");
        prompt.append("   - 강수확률에 따른 방수용품 선택 가이드\n\n");

        prompt.append("3. ⚠️ 날씨 조건에 따른 구체적인 안전 수칙 및 주의사항\n");
        prompt.append("   - 풍속별 텐트 설치 요령 및 고정 방법\n");
        prompt.append("   - 습도와 온도에 따른 건강 관리 팁\n\n");

        prompt.append("4. 🍳 인원수에 맞는 취사용품과 생활용품 가이드\n");
        prompt.append("   - 날씨 조건을 고려한 조리 방법 및 장비 선택\n\n");

        prompt.append("5. 💡 날씨와 캠핑장을 고려한 실용적인 조언 (7-10줄)\n");
        prompt.append("   - 각 날짜별 활동 계획 및 대비책 제시\n");
        prompt.append("   - 날씨 변화에 따른 유연한 대응 방안\n\n");

        // 간단한 JSON 응답 형식 지정
        prompt.append("다음 JSON 형식으로 응답해주세요:\n");
        prompt.append("{\n");
        prompt.append("  \"campgroundName\": \"").append(request.getCampgroundName()).append("\",\n");
        prompt.append("  \"location\": \"").append(request.getLocationInfo()).append("\",\n");
        prompt.append("  \"checkInDate\": \"").append(request.getCheckInDate()).append("\",\n");
        prompt.append("  \"checkOutDate\": \"").append(request.getCheckOutDate()).append("\",\n");
        prompt.append("  \"totalPeople\": ").append(request.getTotalPeople()).append(",\n");
        prompt.append(
                "  \"recommendations\": \"방수 텐트: 6월 26일 강수확률 75%로 높아 방수 기능이 뛰어난 텐트가 필수입니다.\\n텐트 스킨과 플라이시트의 방수 성능을 꼼꼼히 확인하세요.\\n\\n방풍 로프 및 강철 팩: 6월 27일 풍속 5.8m/s로 바람이 다소 강할 수 있으니 텐트를 단단히 고정할 수 있는 튼튼한 팩과 로프를 준비하시면 안전합니다.\\n\\n제습제: 6월 26일 습도 82%로 매우 높아 텐트 내부 습기 제거를 위해 제습제를 여러 개 준비하시면 쾌적한 캠핑에 도움이 됩니다.\\n\\n(위와 같이 각 추천 항목마다 \\\\n\\\\n으로 구분하여 자연스러운 말투로 날씨 수치를 언급하며 총 5개 작성, 브랜드명은 언급하지 말고 일반적인 제품명만 사용)\",\n");
        prompt.append(
                "  \"aiAdvice\": \"6월 26일은 최고 기온 28°C, 최저 기온 21°C로 비교적 높은 기온에 습도 82%, 강수확률 75%로 비가 올 가능성이 매우 높습니다.\\n\\n6월 27일은 최고 기온 26°C, 최저 기온 19°C로... (각 날짜별 구체적 수치 언급하며 문단별로 \\\\n\\\\n 줄바꿈 포함하여 7-10줄 작성, 브랜드명은 언급하지 말 것)\",\n");
        prompt.append("  \"generatedAt\": \"")
                .append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\"\n");
        prompt.append("}\n\n");

        prompt.append("🔥 필수 준수사항 (반드시 지켜주세요):\n\n");

        prompt.append("📊 날씨 수치 언급 필수:\n");
        prompt.append("- recommendations와 aiAdvice에서 위 날씨 수치를 구체적으로 언급해야 함\n");
        prompt.append("- 각 날짜별 기온(최저/최고), 습도(%), 풍속(m/s), 강수확률(%) 수치를 반드시 언급\n");
        prompt.append("- 일반적인 조언 금지, 제공된 실시간 날씨 수치 기반 구체적 조언만 작성\n\n");

        prompt.append("💬 말투 및 표현:\n");
        prompt.append("- 자연스럽고 친근한 말투 사용: '~추천합니다', '~하시면 좋습니다', '~도움됩니다'\n");
        prompt.append("- '필수' 표현은 정말 꼭 필요한 것(텐트, 침낭 등)에만 사용, 나머지는 '추천', '도움됨' 등으로 표현\n\n");

        prompt.append("📝 날씨 기반 표현 예시:\n");
        prompt.append("- '비가 올 수 있다' → '강수확률 70%로 높아 방수 기능이 좋은 텐트를 추천합니다'\n");
        prompt.append("- '바람이 있다' → '풍속 6.5m/s로 강해 텐트 고정을 단단히 하시면 좋습니다'\n");
        prompt.append("- '습하다' → '습도 85%로 매우 높아 제습제와 통풍에 신경쓰시면 도움됩니다'\n");
        prompt.append("- '풍속 4.2m/s로 바람이 있어 방풍막이 있으면 도움됩니다'\n");
        prompt.append("- '습도 79%로 높아 제습제를 준비하시면 좋습니다'\n\n");

        prompt.append("📄 가독성 및 형식:\n");
        prompt.append("- **🚨 중요: recommendations 문자열에는 각 추천 항목 사이마다 반드시 줄바꿈(\\\\n\\\\n)으로 구분해야 합니다!**\n");
        prompt.append(
                "- **줄바꿈 및 가독성**: aiAdvice와 recommendations 모든 항목에서 문단별로 자연스럽게 줄바꿈(\\\\n\\\\n)을 사용하여 가독성 있게 작성해주세요.\n");
        prompt.append("- **aiAdvice 작성법**: 한 문장이 너무 길어지지 않도록 주제별(날씨 조건, 준비사항, 활동 계획 등)로 문단을 나누어 작성하세요.\n");
        prompt.append("- 특히 날짜별 조언, 주제별 내용 구분 시 줄바꿈을 활용하세요.\n");
        prompt.append("- JSON 형식을 정확히 지켜서 응답해주세요.\n\n");

        prompt.append("🏷️ 브랜드명 금지:\n");
        prompt.append("- **⚠️ 절대 금지: 특정 브랜드명(콜맨, 스노우피크, 샤오미, 물먹는 하마, 코베아, 네이쳐하이크 등) 언급 금지**\n");
        prompt.append("- 일반적인 제품명만 사용하세요.\n\n");

        prompt.append("📋 예시 형식:\n");
        prompt.append("**recommendations 예시**:\n");
        prompt.append(
                "\"방수 텐트: 6월 26일 강수확률 75%로 높아 방수 기능이 뛰어난 텐트가 필수입니다.\\\\n텐트 스킨과 플라이시트의 방수 성능을 꼼꼼히 확인하세요.\\\\n\\\\n방풍 로프 및 강철 팩: 6월 27일 풍속 5.8m/s로 바람이 다소 강할 수 있으니 텐트를 단단히 고정할 수 있는 튼튼한 팩과 로프를 준비하시면 안전합니다.\"\n\n");

        prompt.append("**aiAdvice 예시**:\n");
        prompt.append(
                "\"6월 26일은 최고 기온 28°C, 최저 기온 21°C로 비교적 높은 기온에 습도 82%, 강수확률 75%로 비가 올 가능성이 매우 높습니다.\\\\n습도가 높고 비가 예상되어 제습제와 방수용품을 철저히 준비하시면 좋습니다.\\\\n\\\\n6월 27일은 최고 기온 26°C, 최저 기온 19°C로 일교차가 다소 있습니다. 풍속 5.8m/s로 바람이 약간 강하게 불 수 있으니 텐트 고정에 신경 쓰시면 안전합니다.\\\\n전체적으로 습하고 비가 오는 날씨이므로 실내 활동 계획도 함께 세우시면 도움이 됩니다.\"\n\n");
        prompt.append(
                "**중요**: aiAdvice는 위 예시처럼 주제별, 날짜별로 자연스럽게 문단을 나누어 작성해주세요. 한 문장이 너무 길어지지 않도록 \\\\n\\\\n을 활용하여 가독성을 높여주세요.");

        return prompt.toString();
    }

    private String callGeminiAPI(String prompt) throws IOException {
        String requestBody = "{\n" +
                "  \"contents\": [{\n" +
                "    \"parts\": [{\n" +
                "      \"text\": \"" + prompt.replace("\"", "\\\"").replace("\n", "\\n") + "\"\n" +
                "    }]\n" +
                "  }],\n" +
                "  \"generationConfig\": {\n" +
                "    \"temperature\": 0.5,\n" +
                "    \"maxOutputTokens\": 2500\n" +
                "  }\n" +
                "}";

        RequestBody body = RequestBody.create(requestBody, MediaType.get("application/json; charset=utf-8"));
        Request request = new Request.Builder()
                .url(GEMINI_API_URL + "?key=" + apiKey)
                .post(body)
                .addHeader("Content-Type", "application/json")
                .build();

        try (Response response = httpClient.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Gemini API 호출 실패: " + response);
            }

            return response.body().string();
        }
    }

    private CampingChecklistResponseDTO parseResponse(String response, CampingChecklistRequestDTO request) {
        try {
            JsonNode root = objectMapper.readTree(response);
            JsonNode candidates = root.path("candidates");

            if (candidates.isArray() && candidates.size() > 0) {
                JsonNode content = candidates.get(0).path("content");
                JsonNode parts = content.path("parts");

                if (parts.isArray() && parts.size() > 0) {
                    String text = parts.get(0).path("text").asText();

                    // JSON 부분만 추출
                    int startIndex = text.indexOf("{");
                    int lastBraceIndex = text.lastIndexOf("}");

                    if (startIndex >= 0 && lastBraceIndex > startIndex) {
                        String jsonText = text.substring(startIndex, lastBraceIndex + 1);

                        // JSON 문자열 내의 제어 문자들을 이스케이프 처리
                        jsonText = cleanJsonString(jsonText);

                        try {
                            JsonNode checklistData = objectMapper.readTree(jsonText);
                            CampingChecklistResponseDTO result = buildResponseFromJson(checklistData, request);

                            // 토큰 사용량 정보 추가
                            addTokenUsageInfo(result, root);

                            return result;
                        } catch (Exception jsonEx) {
                            log.warn("JSON 파싱 실패, 기본 응답으로 대체: {}", jsonEx.getMessage());
                            return createFallbackResponse(request);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Gemini API 응답 파싱 중 오류 발생", e);
        }

        return createFallbackResponse(request);
    }

    /**
     * JSON 문자열 내의 제어 문자들을 이스케이프 처리
     */
    private String cleanJsonString(String jsonText) {
        if (jsonText == null) {
            return null;
        }

        try {
            StringBuilder result = new StringBuilder();
            boolean inString = false;
            boolean escaped = false;

            for (int i = 0; i < jsonText.length(); i++) {
                char c = jsonText.charAt(i);

                if (escaped) {
                    // 이미 이스케이프된 문자는 그대로 유지
                    result.append(c);
                    escaped = false;
                    continue;
                }

                if (c == '\\') {
                    // 백슬래시 발견 - 다음 문자가 이스케이프 대상인지 확인
                    result.append(c);
                    escaped = true;
                    continue;
                }

                if (c == '"' && !escaped) {
                    // 문자열 시작/끝 확인
                    inString = !inString;
                    result.append(c);
                    continue;
                }

                if (inString) {
                    // 문자열 내부에서만 제어 문자 처리
                    switch (c) {
                        case '\n':
                            result.append("\\n");
                            break;
                        case '\r':
                            result.append("\\r");
                            break;
                        case '\t':
                            result.append("\\t");
                            break;
                        case '\b':
                            result.append("\\b");
                            break;
                        case '\f':
                            result.append("\\f");
                            break;
                        default:
                            if (c < 32) {
                                // 다른 제어 문자들은 유니코드로 변환
                                result.append(String.format("\\u%04x", (int) c));
                            } else {
                                result.append(c);
                            }
                            break;
                    }
                } else {
                    // 문자열 외부에서는 그대로 유지
                    result.append(c);
                }
            }

            return result.toString();

        } catch (Exception e) {
            log.warn("JSON 문자열 정리 실패, 원본 반환: {}", e.getMessage());
            return jsonText;
        }
    }

    /**
     * JSON에서 파싱된 문자열의 이스케이프 문자들을 실제 문자로 복원
     */
    private String unescapeJsonString(String text) {
        if (text == null) {
            return null;
        }

        return text.replace("\\\\n", "\\n")
                .replace("\\\\r", "\\r")
                .replace("\\\\t", "\\t")
                .replace("\\\\\"", "\"")
                .replace("\\\\\\\\", "\\\\");
    }

    /**
     * Gemini API 응답에서 토큰 사용량 정보 추출 및 설정
     */
    private void addTokenUsageInfo(CampingChecklistResponseDTO response, JsonNode apiResponse) {
        try {
            JsonNode usageMetadata = apiResponse.path("usageMetadata");
            if (!usageMetadata.isMissingNode()) {
                int promptTokenCount = usageMetadata.path("promptTokenCount").asInt(0);
                int candidatesTokenCount = usageMetadata.path("candidatesTokenCount").asInt(0);
                int totalTokenCount = usageMetadata.path("totalTokenCount").asInt(0);

                // 기존 generatedAt에 토큰 정보 추가하거나 별도 필드로 설정
                String originalGeneratedAt = response.getGeneratedAt();
                String enhancedInfo = originalGeneratedAt + " | 토큰 사용량 - 입력: " + promptTokenCount +
                        ", 출력: " + candidatesTokenCount + ", 총: " + totalTokenCount;
                response.setGeneratedAt(enhancedInfo);

                log.info("Gemini API 토큰 사용량 - 입력: " + promptTokenCount +
                        ", 출력: " + candidatesTokenCount + ", 총: " + totalTokenCount);
            }
        } catch (Exception e) {
            log.warn("토큰 사용량 정보 추출 실패: {}", e.getMessage());
        }
    }

    private CampingChecklistResponseDTO buildResponseFromJson(JsonNode jsonData, CampingChecklistRequestDTO request) {
        CampingChecklistResponseDTO response = new CampingChecklistResponseDTO();

        // 기본 정보 설정
        response.setCampgroundName(jsonData.path("campgroundName").asText(request.getCampgroundName()));
        response.setLocation(jsonData.path("location").asText(request.getLocationInfo()));
        response.setCheckInDate(jsonData.path("checkInDate").asText(request.getCheckInDate().toString()));
        response.setCheckOutDate(jsonData.path("checkOutDate").asText(request.getCheckOutDate().toString()));
        response.setTotalPeople(jsonData.path("totalPeople").asInt(request.getTotalPeople()));
        response.setGeneratedAt(jsonData.path("generatedAt").asText());

        // 추천사항 파싱 (이스케이프된 문자들을 실제 문자로 복원)
        String recommendations = jsonData.path("recommendations").asText();
        recommendations = unescapeJsonString(recommendations);

        // recommendations 문자열을 List로 변환 (기존 DTO 호환성 유지)
        List<String> specialRecommendations = new ArrayList<>();
        if (recommendations != null && !recommendations.isEmpty()) {
            specialRecommendations.add(recommendations);
        }
        response.setSpecialRecommendations(specialRecommendations);

        // AI 조언 (이스케이프된 문자들을 실제 문자로 복원)
        String aiAdvice = jsonData.path("aiAdvice").asText();
        aiAdvice = unescapeJsonString(aiAdvice);
        response.setAiAdvice(aiAdvice);

        return response;
    }

    private CampingChecklistResponseDTO createFallbackResponse(CampingChecklistRequestDTO request) {
        CampingChecklistResponseDTO response = new CampingChecklistResponseDTO();

        // 실제 예약 정보로 기본값 설정
        response.setCampgroundName(request.getCampgroundName());
        response.setLocation(request.getLocationInfo());
        response.setCheckInDate(request.getCheckInDate().toString());
        response.setCheckOutDate(request.getCheckOutDate().toString());
        response.setTotalPeople(request.getTotalPeople());
        response.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 빈 추천사항 (AI 서비스 오류 시에는 추천하지 않음)
        response.setSpecialRecommendations(new ArrayList<>());

        // AI 서비스 오류 메시지만
        response.setAiAdvice("캠피아 AI 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");

        return response;
    }

}