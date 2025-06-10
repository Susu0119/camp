package com.m4gi.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;
import com.m4gi.dto.ChecklistDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.ChecklistService;
import com.m4gi.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/camping-checklist")
@Slf4j
public class CampingChecklistController {

    private final GeminiService geminiService;
    private final ChecklistService checklistService;
    private final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * 예약 ID로 체크리스트 조회
     */
    @GetMapping("/reservation/{reservationId}")
    public ResponseEntity<Map<String, Object>> getChecklistByReservationId(
            @PathVariable String reservationId, HttpSession session) {

        try {
            // 세션에서 사용자 정보 확인
            UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
            if (loginUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "error", "로그인이 필요합니다."));
            }

            // 체크리스트 조회
            java.util.List<ChecklistDTO> checklists = checklistService.getChecklistsByReservationId(reservationId);

            if (checklists.isEmpty()) {
                return ResponseEntity.ok(Map.of("success", false, "error", "체크리스트를 찾을 수 없습니다."));
            }

            // 가장 최근 체크리스트 사용
            ChecklistDTO latestChecklist = checklists.get(0);

            // JSON에서 데이터 파싱
            Map<String, Object> checklistData = objectMapper.readValue(latestChecklist.getDescription(), Map.class);

            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("recommendations", checklistData.get("recommendations"));
            response.put("advice", checklistData.get("advice"));
            response.put("generatedAt", latestChecklist.getCreatedAt().toString());

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            log.error("체크리스트 조회 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("success", false, "error", "체크리스트 조회에 실패했습니다."));
        }
    }

    /**
     * 캠핑 준비물 추천 - Gemini AI 응답 반환
     */
    @PostMapping("/generate")
    public ResponseEntity<Map<String, Object>> generateCampingChecklist(
            @RequestBody Map<String, Object> request, HttpSession session) {

        try {
            // 세션에서 사용자 정보 확인
            UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
            if (loginUser == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "error", "로그인이 필요합니다."));
            }

            Integer providerCode = (Integer) session.getAttribute("providerCode");
            String providerUserId = (String) session.getAttribute("providerUserId");

            if (providerCode == null || providerUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "error", "사용자 인증 정보가 없습니다."));
            }

            // 필수 파라미터 추출
            String campgroundName = (String) request.get("campgroundName");
            String location = (String) request.get("location");
            String checkInDate = (String) request.get("checkInDate");
            String checkOutDate = (String) request.get("checkOutDate");
            Integer totalPeople = (Integer) request.get("totalPeople");
            String reservationId = (String) request.get("reservationId");
            String reservationSite = (String) request.get("reservationSite");

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

            if (reservationId == null || reservationId.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "예약 ID가 필요합니다."));
            }

            if (reservationSite == null || reservationSite.trim().isEmpty()) {
                return ResponseEntity.badRequest()
                        .body(Map.of("success", false, "error", "사이트 정보가 필요합니다."));
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
                // 체크리스트를 데이터베이스에 저장
                try {
                    // 체크리스트 ID 생성
                    String checklistId = UUID.randomUUID().toString();

                    // advice와 recommendations만 추출하여 description 필드에 저장
                    Map<String, Object> checklistData = new HashMap<>();

                    // recommendations 처리 (List<String>을 문자열로 변환)
                    String recommendationsText = "";
                    if (geminiResponse.getSpecialRecommendations() != null
                            && !geminiResponse.getSpecialRecommendations().isEmpty()) {
                        recommendationsText = String.join(" ", geminiResponse.getSpecialRecommendations());
                    }

                    // advice 처리 (마침표 후처리 제거 - AI가 자연스럽게 줄바꿈 처리)
                    String adviceText = geminiResponse.getAiAdvice();

                    checklistData.put("recommendations", recommendationsText);
                    checklistData.put("advice", adviceText);

                    String checklistJson = objectMapper.writeValueAsString(checklistData);

                    // ChecklistDTO 생성
                    ChecklistDTO checklistDTO = new ChecklistDTO();
                    checklistDTO.setChecklistId(checklistId);
                    checklistDTO.setProviderCode(providerCode);
                    checklistDTO.setProviderUserId(providerUserId);
                    checklistDTO.setDescription(checklistJson);

                    // reservationSite를 안전하게 Integer로 변환
                    try {
                        checklistDTO.setSiteId(Integer.parseInt(reservationSite));
                    } catch (NumberFormatException e) {
                        log.warn("reservationSite가 숫자가 아님: '{}'. 기본값 0 사용", reservationSite);
                        checklistDTO.setSiteId(0); // 기본값 설정
                    }

                    checklistDTO.setReservationId(reservationId);

                    // 데이터베이스에 저장
                    int saved = checklistService.saveChecklist(checklistDTO);
                    if (saved > 0) {
                        log.info("체크리스트 저장 완료 - ID: {}, 예약ID: {}", checklistId, reservationId);
                    } else {
                        log.warn("체크리스트 저장 실패 - 예약ID: {}", reservationId);
                    }
                } catch (Exception e) {
                    log.error("체크리스트 저장 중 오류 발생", e);
                    // 저장 실패해도 AI 응답은 반환
                }

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