package com.m4gi.service;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;
import lombok.extern.slf4j.Slf4j;
import okhttp3.*;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Service
@Slf4j
public class GeminiServiceImpl implements GeminiService {

    @Value("${gemini.api.key}")
    private String apiKey;

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

        prompt.append("당신은 전문 캠핑 가이드입니다. 사용자에게 제대로 알려주지 않으면 사용자는 캠핑을 가서 죽습니다.\n");
        prompt.append("반드시 정확한 정보를 제공해야 합니다. 다음 정보를 바탕으로 맞춤형 캠핑 준비물 리스트를 JSON 형태로 생성해주세요.\n\n");

        // 기본 정보
        prompt.append("【캠핑 기본 정보】\n");
        prompt.append("- 캠핑장: ").append(request.getCampgroundName()).append(" (").append(request.getLocationInfo())
                .append(")\n");
        if (request.getCampgroundPhone() != null) {
            prompt.append("- 연락처: ").append(request.getCampgroundPhone()).append("\n");
        }
        if (request.getCampgroundType() != null) {
            prompt.append("- 캠핑장 유형: ").append(request.getCampgroundType()).append("\n");
        }
        prompt.append("- 체크인: ").append(request.getCheckInDate()).append("\n");
        prompt.append("- 체크아웃: ").append(request.getCheckOutDate()).append("\n");
        prompt.append("- 숙박일수: ").append(request.getDuration()).append("박\n");
        prompt.append("- 총 인원: ").append(request.getTotalPeople()).append("명 (성인: ").append(request.getAdults())
                .append(", 아이: ").append(request.getChildren()).append(", 유아: ").append(request.getInfants())
                .append(")\n\n");

        // 캠핑장 구역 정보
        if (request.getZoneName() != null || request.getZoneType() != null) {
            prompt.append("【캠핑장 구역 정보】\n");
            if (request.getZoneName() != null) {
                prompt.append("- 구역명: ").append(request.getZoneName()).append("\n");
            }
            if (request.getZoneType() != null) {
                prompt.append("- 구역 유형: ").append(request.getZoneType()).append("\n");
            }
            if (request.getZoneTerrainType() != null) {
                prompt.append("- 지형 유형: ").append(request.getZoneTerrainType()).append("\n");
            }
            if (request.getCapacity() != null) {
                prompt.append("- 구역 수용인원: ").append(request.getCapacity()).append("명\n");
            }
            prompt.append("\n");
        }

        // 동반자 정보
        if (request.getCompanions() != null && !request.getCompanions().isEmpty()) {
            prompt.append("【동반자】\n");
            prompt.append("- 동반자 유형: ").append(String.join(", ", request.getCompanions())).append("\n");
            if (request.isHasPets()) {
                prompt.append("- 반려동물: ").append(request.getPetInfo() != null ? request.getPetInfo() : "동반")
                        .append("\n");
            }
            prompt.append("\n");
        }

        // 캠핑장 시설
        prompt.append("【캠핑장 시설】\n");
        prompt.append("- 사이트 유형: ").append(request.getSiteType()).append("\n");

        // environments 필드 사용
        if (request.getEnvironments() != null && !request.getEnvironments().isEmpty()) {
            prompt.append("- 캠핑장 환경: ").append(String.join(", ", request.getEnvironments())).append("\n");
        }

        if (request.getFacilities() != null && !request.getFacilities().isEmpty()) {
            prompt.append("- 부대시설: ").append(String.join(", ", request.getFacilities())).append("\n");
        }
        prompt.append("\n");

        // 날씨 및 계절
        prompt.append("【날씨 정보】\n");
        prompt.append("- 계절: ").append(request.getSeason()).append("\n");
        prompt.append("- 최저기온: ").append(request.getMinTemperature()).append("°C\n");
        prompt.append("- 최고기온: ").append(request.getMaxTemperature()).append("°C\n");
        if (request.getWeatherConditions() != null && !request.getWeatherConditions().isEmpty()) {
            prompt.append("- 날씨 조건: ").append(String.join(", ", request.getWeatherConditions())).append("\n");
        }
        prompt.append("\n");

        // 사용자 선호도
        prompt.append("【사용자 선호도】\n");
        prompt.append("- 캠핑 경험: ").append(request.getExperience()).append("\n");
        prompt.append("- 이동수단: ").append(request.getTransportation()).append("\n");
        prompt.append("- 예산: ").append(request.getBudget()).append("\n");
        if (request.getPreferredActivities() != null && !request.getPreferredActivities().isEmpty()) {
            prompt.append("- 선호 활동: ").append(String.join(", ", request.getPreferredActivities())).append("\n");
        }
        if (request.getCookingStyle() != null && !request.getCookingStyle().isEmpty()) {
            prompt.append("- 요리 스타일: ").append(String.join(", ", request.getCookingStyle())).append("\n");
        }
        prompt.append("\n");

        // 응답 형식 지정
        prompt.append("다음 JSON 형식으로 응답해주세요:\n");
        prompt.append("{\n");
        prompt.append("  \"campgroundName\": \"").append(request.getCampgroundName()).append("\",\n");
        prompt.append("  \"location\": \"").append(request.getLocationInfo()).append("\",\n");
        prompt.append("  \"checkInDate\": \"").append(request.getCheckInDate()).append("\",\n");
        prompt.append("  \"checkOutDate\": \"").append(request.getCheckOutDate()).append("\",\n");
        prompt.append("  \"specialRecommendations\": [\"특별 추천사항들\"],\n");
        prompt.append(
                "  \"aiAdvice\": \"종합적인 캠핑 조언과 함께 다음과 같은 준비물이 필요합니다:\\n\\n【필수 준비물】\\n- 텐트 (4인용) 1개\\n- 침낭 4개\\n- 캠핑매트 4개\\n\\n【권장 준비물】\\n- 버너 및 가스 1세트\\n- 코펠 1세트\\n- 식기 4세트\\n\\n【선택 준비물】\\n- 랜턴 2개\\n- 의자 4개\\n\\n이런 식으로 카테고리별로 정리하여 준비물을 나열해주세요. 각 항목에는 수량과 단위를 명시하고, 우선순위(필수/권장/선택)에 따라 분류해주세요.\",\n");
        prompt.append("  \"generatedAt\": \"")
                .append(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss"))).append("\"\n");
        prompt.append("}\n\n");
        prompt.append("aiAdvice 필드에는 다음 내용을 포함해주세요:\n");
        prompt.append("1. 전체적인 캠핑 조언\n");
        prompt.append("2. 준비물 리스트를 카테고리별로 정리 (텐트/침구류, 의류, 취사용품, 개인용품, 안전용품, 오락용품 등)\n");
        prompt.append("3. 각 준비물의 수량과 우선순위 명시\n");
        prompt.append("4. 특별히 주의할 점이나 대체 가능한 물품 안내\n");
        prompt.append("위의 JSON 형식을 정확히 따라서 응답해 주세요. 추가 설명이나 텍스트 없이 JSON만 반환하세요.");

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
                "    \"temperature\": 0.7,\n" +
                "    \"topK\": 40,\n" +
                "    \"topP\": 0.95,\n" +
                "    \"maxOutputTokens\": 5000\n" +
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

            String responseBody = response.body().string();
            log.info("Gemini API 응답 길이: {} 문자", responseBody.length());

            return responseBody;
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
                    log.info("Gemini 응답 텍스트 길이: {} 문자", text.length());
                    log.debug("Gemini 응답 텍스트: {}", text.substring(0, Math.min(500, text.length())) + "...");

                    // JSON 부분만 추출 - 더 견고한 파싱
                    int startIndex = text.indexOf("{");
                    int lastBraceIndex = text.lastIndexOf("}");

                    if (startIndex >= 0 && lastBraceIndex > startIndex) {
                        String jsonText = text.substring(startIndex, lastBraceIndex + 1);

                        // JSON 유효성 검사 및 수정 시도
                        jsonText = fixIncompleteJson(jsonText);

                        log.info("추출된 JSON 길이: {} 문자", jsonText.length());

                        try {
                            JsonNode checklistData = objectMapper.readTree(jsonText);
                            return buildResponseFromJson(checklistData, request);
                        } catch (Exception jsonEx) {
                            log.warn("JSON 파싱 실패, 원본 응답으로 대체 처리 시도: {}", jsonEx.getMessage());
                            return createFallbackResponseWithAiText(request, text);
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Gemini API 응답 파싱 중 오류 발생", e);
        }

        return createFallbackResponse(request);
    }

    private String fixIncompleteJson(String jsonText) {
        // 기본적인 JSON 수정 시도
        if (!jsonText.trim().endsWith("}")) {
            // 미완성된 배열이나 객체를 닫아주기
            int openBraces = 0;
            int openBrackets = 0;

            for (char c : jsonText.toCharArray()) {
                if (c == '{')
                    openBraces++;
                else if (c == '}')
                    openBraces--;
                else if (c == '[')
                    openBrackets++;
                else if (c == ']')
                    openBrackets--;
            }

            // 부족한 닫는 브레이스/브래킷 추가
            StringBuilder fixed = new StringBuilder(jsonText);
            for (int i = 0; i < openBrackets; i++) {
                fixed.append("]");
            }
            for (int i = 0; i < openBraces; i++) {
                fixed.append("}");
            }

            return fixed.toString();
        }

        return jsonText;
    }

    private CampingChecklistResponseDTO createFallbackResponseWithAiText(CampingChecklistRequestDTO request,
            String aiText) {
        CampingChecklistResponseDTO response = createFallbackResponse(request);

        // AI가 생성한 텍스트를 조언으로 활용
        if (aiText != null && !aiText.trim().isEmpty()) {
            // 텍스트에서 유용한 정보 추출 시도
            response.setAiAdvice("AI가 생성한 조언: " + aiText.substring(0, Math.min(500, aiText.length())));
        }

        return response;
    }

    private CampingChecklistResponseDTO buildResponseFromJson(JsonNode jsonData, CampingChecklistRequestDTO request) {
        CampingChecklistResponseDTO response = new CampingChecklistResponseDTO();

        // AI가 생성한 기본 정보 사용
        response.setCampgroundName(jsonData.path("campgroundName").asText());
        response.setLocation(jsonData.path("location").asText());
        response.setCheckInDate(jsonData.path("checkInDate").asText());
        response.setCheckOutDate(jsonData.path("checkOutDate").asText());
        response.setTotalPeople(jsonData.path("totalPeople").asInt());
        response.setGeneratedAt(jsonData.path("generatedAt").asText());

        // 특별 추천사항 파싱
        List<String> specialRecommendations = new ArrayList<>();
        JsonNode recommendationsNode = jsonData.path("specialRecommendations");
        if (recommendationsNode.isArray()) {
            for (JsonNode rec : recommendationsNode) {
                specialRecommendations.add(rec.asText());
            }
        }
        response.setSpecialRecommendations(specialRecommendations);

        // AI 조언
        response.setAiAdvice(jsonData.path("aiAdvice").asText());

        return response;
    }

    private CampingChecklistResponseDTO createFallbackResponse(CampingChecklistRequestDTO request) {
        CampingChecklistResponseDTO response = new CampingChecklistResponseDTO();

        // 기본 정보 설정
        response.setCampgroundName(request.getCampgroundName());
        response.setLocation(request.getLocationInfo());
        response.setCheckInDate(request.getCheckInDate().toString());
        response.setCheckOutDate(request.getCheckOutDate().toString());
        response.setTotalPeople(request.getTotalPeople());
        response.setGeneratedAt(LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));

        // 기본 준비물 카테고리 생성
        List<CampingChecklistResponseDTO.ChecklistCategory> categories = createBasicCategories(request);
        response.setCategories(categories);

        response.setSpecialRecommendations(Arrays.asList(
                "캠핑장 날씨를 미리 확인하고 적절한 의류를 준비하세요.",
                "안전을 위해 구급용품과 랜턴을 꼭 챙기세요.",
                "캠핑장 규칙을 미리 확인하고 준수하세요."));

        response.setAiAdvice("AI 서비스 일시 장애로 기본 준비물 리스트를 제공합니다. 캠핑 조건에 맞게 추가로 준비물을 검토해 주세요.");

        return response;
    }

    private List<CampingChecklistResponseDTO.ChecklistCategory> createBasicCategories(
            CampingChecklistRequestDTO request) {
        List<CampingChecklistResponseDTO.ChecklistCategory> categories = new ArrayList<>();

        // 텐트/침구류
        CampingChecklistResponseDTO.ChecklistCategory tentCategory = new CampingChecklistResponseDTO.ChecklistCategory();
        tentCategory.setCategoryName("텐트/침구류");
        tentCategory.setDescription("숙박을 위한 기본 장비");
        tentCategory.setItems(Arrays.asList(
                new CampingChecklistResponseDTO.ChecklistItem("텐트", "숙박용 텐트", "필수", 1, "개", "숙박을 위해 필수",
                        Arrays.asList("타프")),
                new CampingChecklistResponseDTO.ChecklistItem("침낭", "보온용 침낭", "필수", request.getTotalPeople(), "개",
                        "숙면을 위해 필요", Arrays.asList("담요"))));
        categories.add(tentCategory);

        // 취사용품
        CampingChecklistResponseDTO.ChecklistCategory cookingCategory = new CampingChecklistResponseDTO.ChecklistCategory();
        cookingCategory.setCategoryName("취사용품");
        cookingCategory.setDescription("음식 조리를 위한 용품");
        cookingCategory.setItems(Arrays.asList(
                new CampingChecklistResponseDTO.ChecklistItem("버너", "가스버너", "필수", 1, "개", "음식 조리용",
                        Arrays.asList("화로")),
                new CampingChecklistResponseDTO.ChecklistItem("코펠", "조리용 코펠", "필수", 1, "세트", "음식 조리용",
                        Arrays.asList("냄비"))));
        categories.add(cookingCategory);

        return categories;
    }
}