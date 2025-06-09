package com.m4gi.controller;

import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;
import com.m4gi.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/camping-checklist")
@CrossOrigin(origins = { "http://localhost:5173", "http://34.168.101.140" }, allowCredentials = "true")
@Slf4j
public class CampingChecklistController {

    private final GeminiService geminiService;

    /**
     * 캠핑 준비물 추천 - Gemini AI 응답 반환
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateCampingChecklist(
            @RequestBody Map<String, Object> request) {

        try {
            // 필수 파라미터 추출
            String campgroundName = (String) request.get("campgroundName");
            String location = (String) request.get("location");
            String checkInDate = (String) request.get("checkInDate");
            String checkOutDate = (String) request.get("checkOutDate");
            Integer totalPeople = (Integer) request.get("totalPeople");

            log.info("캠핑 준비물 리스트 생성 요청 - 캠핑장: {}, 인원: {}명", campgroundName, totalPeople);

            // 기본 유효성 검사
            if (campgroundName == null || campgroundName.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "캠핑장 이름이 필요합니다."));
            }

            if (totalPeople == null || totalPeople <= 0) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "인원수가 필요합니다. (1명 이상)"));
            }

            if (checkInDate == null || checkOutDate == null) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "체크인/체크아웃 날짜가 필요합니다."));
            }

            // DTO 생성 (필수 정보만)
            CampingChecklistRequestDTO dto = new CampingChecklistRequestDTO();
            dto.setCampgroundName(campgroundName);
            dto.setAddrFull(location != null ? location : "");
            dto.setCheckInDate(java.time.LocalDate.parse(checkInDate));
            dto.setCheckOutDate(java.time.LocalDate.parse(checkOutDate));
            dto.setTotalPeople(totalPeople);

            // 선택적 정보 설정
            if (request.get("zoneName") != null) {
                dto.setZoneName((String) request.get("zoneName"));
            }
            if (request.get("zoneType") != null) {
                dto.setZoneType((String) request.get("zoneType"));
            }
            // 날씨 정보는 실시간 API에서 자동으로 가져옴

            // Gemini API 호출
            CampingChecklistResponseDTO geminiResponse = geminiService.generateCampingChecklist(dto);

            if (geminiResponse != null) {
                Map<String, Object> response = new HashMap<>();
                response.put("success", true);
                response.put("campgroundName", geminiResponse.getCampgroundName());
                response.put("location", geminiResponse.getLocation());
                response.put("checkInDate", geminiResponse.getCheckInDate());
                response.put("checkOutDate", geminiResponse.getCheckOutDate());
                response.put("totalPeople", geminiResponse.getTotalPeople());
                response.put("recommendations", geminiResponse.getSpecialRecommendations());
                response.put("advice", geminiResponse.getAiAdvice());
                response.put("generatedAt", geminiResponse.getGeneratedAt());

                // 토큰 사용량 정보 추출 (generatedAt에서 분리)
                String generatedAtInfo = geminiResponse.getGeneratedAt();
                if (generatedAtInfo.contains("토큰 사용량")) {
                    String[] parts = generatedAtInfo.split(" \\| ");
                    if (parts.length > 1) {
                        response.put("generatedAt", parts[0]); // 순수 시간 정보만

                        // 토큰 정보 파싱
                        String tokenInfo = parts[1];
                        Map<String, Object> tokenUsage = new HashMap<>();

                        try {
                            // "토큰 사용량 - 입력: 123, 출력: 456, 총: 579" 형태에서 숫자 추출
                            String[] tokenParts = tokenInfo.split(",");
                            for (String part : tokenParts) {
                                if (part.contains("입력:")) {
                                    int inputTokens = Integer.parseInt(part.replaceAll("[^0-9]", ""));
                                    tokenUsage.put("inputTokens", inputTokens);
                                } else if (part.contains("출력:")) {
                                    int outputTokens = Integer.parseInt(part.replaceAll("[^0-9]", ""));
                                    tokenUsage.put("outputTokens", outputTokens);
                                } else if (part.contains("총:")) {
                                    int totalTokens = Integer.parseInt(part.replaceAll("[^0-9]", ""));
                                    tokenUsage.put("totalTokens", totalTokens);
                                }
                            }
                            response.put("tokenUsage", tokenUsage);
                        } catch (Exception e) {
                            log.warn("토큰 정보 파싱 실패: {}", e.getMessage());
                        }
                    }
                }

                log.info("캠핑 준비물 리스트 생성 완료");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body(Map.of("success", false, "error", "AI 응답 생성에 실패했습니다."));
            }

        } catch (Exception e) {
            log.error("캠핑 준비물 리스트 생성 중 오류 발생", e);

            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "AI 서비스가 일시적으로 사용할 수 없습니다. 잠시 후 다시 시도해주세요.");

            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }
}