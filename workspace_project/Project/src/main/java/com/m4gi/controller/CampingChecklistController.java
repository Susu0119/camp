package com.m4gi.controller;

import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.service.GeminiService;
import com.m4gi.service.ReservationService;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.format.DateTimeParseException;
import java.time.temporal.ChronoUnit;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/camping-checklist")
@CrossOrigin(origins = { "http://localhost:5173", "http://34.168.101.140" }, allowCredentials = "true")
@Slf4j
public class CampingChecklistController {

    private final GeminiService geminiService;
    private final ReservationService reservationService;

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
            String checkInDateStr = (String) request.get("checkInDate");
            String checkOutDateStr = (String) request.get("checkOutDate");
            Integer totalPeople = (Integer) request.get("totalPeople");

            log.info("캠핑 준비물 리스트 생성 요청 - 캠핑장: {}, 인원: {}명", campgroundName, totalPeople);

            // 기본 유효성 검사
            if (campgroundName == null || campgroundName.trim().isEmpty()) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "캠핑장 이름이 필요합니다."));
            }
            if (totalPeople == null || totalPeople <= 0) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "인원수가 필요합니다. (1명 이상)"));
            }
            if (checkInDateStr == null || checkOutDateStr == null) {
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "체크인/체크아웃 날짜가 필요합니다."));
            }

            // 날짜 유효성 검사 로직 추가
            LocalDate checkInDate;
            LocalDate checkOutDate;
            try {
                checkInDate = LocalDate.parse(checkInDateStr);
                checkOutDate = LocalDate.parse(checkOutDateStr);

                if (checkOutDate.isBefore(checkInDate)) {
                    return ResponseEntity.badRequest().body(Map.of("success", false, "error", "체크아웃 날짜는 체크인 날짜보다 이전일 수 없습니다."));
                }
            } catch (DateTimeParseException e) {
                log.warn("날짜 형식 오류: {}", e.getMessage());
                return ResponseEntity.badRequest().body(Map.of("success", false, "error", "날짜 형식이 올바르지 않습니다. (예: YYYY-MM-DD)"));
            }

            // DTO 생성 (필수 정보만)
            CampingChecklistRequestDTO dto = new CampingChecklistRequestDTO();
            dto.setCampgroundName(campgroundName);
            dto.setAddrFull(location != null ? location : "");
            dto.setCheckInDate(checkInDate); // 파싱된 날짜 객체 사용
            dto.setCheckOutDate(checkOutDate); // 파싱된 날짜 객체 사용
            dto.setTotalPeople(totalPeople);

            // 선택적 정보 설정
            if (request.get("zoneName") != null) dto.setZoneName((String) request.get("zoneName"));
            if (request.get("zoneType") != null) dto.setZoneType((String) request.get("zoneType"));

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
                
                String generatedAtInfo = geminiResponse.getGeneratedAt();
                if (generatedAtInfo.contains("토큰 사용량")) {
                    String[] parts = generatedAtInfo.split(" \\| ");
                    response.put("generatedAt", parts[0]);
                    
                    try {
                        String tokenInfo = parts[1];
                        Map<String, Object> tokenUsage = new HashMap<>();
                        // 정규식을 사용하여 숫자만 추출
                        String[] numbers = tokenInfo.replaceAll("[^0-9,]", "").split(",");
                        if (numbers.length >= 3) {
                            tokenUsage.put("inputTokens", Integer.parseInt(numbers[0]));
                            tokenUsage.put("outputTokens", Integer.parseInt(numbers[1]));
                            tokenUsage.put("totalTokens", Integer.parseInt(numbers[2]));
                        }
                        response.put("tokenUsage", tokenUsage);
                    } catch (Exception e) {
                        log.warn("토큰 정보 파싱 실패: {}", e.getMessage());
                    }
                } else {
                    response.put("generatedAt", generatedAtInfo);
                }

                log.info("캠핑 준비물 리스트 생성 완료");
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "error", "AI 응답 생성에 실패했습니다."));
            }

        } catch (Exception e) {
            log.error("캠핑 준비물 리스트 생성 중 오류 발생", e);
            Map<String, Object> errorResponse = new HashMap<>();
            errorResponse.put("success", false);
            errorResponse.put("error", "서버 내부 오류가 발생했습니다. 잠시 후 다시 시도해주세요.");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(errorResponse);
        }
    }

    /**
     * 예약 ID 기반 캠핑 준비물 리스트 생성
     */
    @GetMapping("/generate-by-reservation/{reservationId}")
    public ResponseEntity<CampingChecklistResponseDTO> generateChecklistByReservation(
            @PathVariable String reservationId,
            @RequestParam(required = false) String season,
            @RequestParam(defaultValue = "중급") String experience,
            @RequestParam(required = false) String companions,
            @RequestParam(required = false) String activities,
            @RequestParam(defaultValue = "자차") String transportation,
            @RequestParam(defaultValue = "중예산") String budget) {
        try {
            log.info("예약 기반 캠핑 준비물 리스트 생성 요청 - 예약 ID: {}", reservationId);
            ReservationDTO reservation = reservationService.findReservationById(reservationId);
            
            if (reservation == null) {
                log.warn("예약 정보를 찾을 수 없습니다. 예약 ID: {}", reservationId);
                return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
            }

            CampingChecklistRequestDTO request = mapReservationToChecklistRequest(reservation);

            // 사용자 입력 추가 처리
            if (season != null) {
                request.setSeason(season);
                setTemperatureBySeason(request, season);
            }
            if (experience != null) request.setExperience(experience);
            if (companions != null) request.setCompanions(companions);
            if (activities != null) request.setActivities(activities);
            if (transportation != null) request.setTransportation(transportation);
            if (budget != null) request.setBudget(budget);

            CampingChecklistResponseDTO response = geminiService.generateCampingChecklist(request);
            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            log.error("예약 기반 캠핑 준비물 리스트 생성 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 간편 캠핑 준비물 리스트 생성
     */
    @GetMapping("/generate-simple")
    public ResponseEntity<CampingChecklistResponseDTO> generateSimpleCampingChecklist(
            @RequestParam String campgroundName,
            @RequestParam String location,
            @RequestParam int totalPeople,
            @RequestParam(defaultValue = "여름") String season,
            @RequestParam(defaultValue = "1") int duration,
            @RequestParam(defaultValue = "중급") String experience,
            @RequestParam(defaultValue = "자차") String transportation) {
        try {
            log.info("간편 캠핑 준비물 리스트 생성 요청 - 캠핑장: {}, 인원: {}명", campgroundName, totalPeople);
            CampingChecklistRequestDTO request = new CampingChecklistRequestDTO();
            request.setCampgroundName(campgroundName);
            request.setAddrFull(location);
            request.setTotalPeople(totalPeople);
            request.setAdults(totalPeople);
            request.setChildren(0);
            request.setInfants(0);
            request.setDuration(duration);
            request.setSeason(season);
            request.setExperience(experience);
            request.setTransportation(transportation);
            request.setZoneType("오토캠핑");
            request.setCampgroundType("AUTO");
            request.setHasElectricity(true);
            request.setHasWater(true);
            request.setBudget("중예산");
            setTemperatureBySeason(request, season);

            CampingChecklistResponseDTO response = geminiService.generateCampingChecklist(request);
            if (response != null) {
                return ResponseEntity.ok(response);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }
        } catch (Exception e) {
            log.error("간편 캠핑 준비물 리스트 생성 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * AI 응답만 반환하는 엔드포인트
     */
    @PostMapping("/generate-ai-only")
    public ResponseEntity<Map<String, Object>> generateAiOnlyChecklist(
            @RequestBody CampingChecklistRequestDTO request) {
        log.info("AI 전용 캠핑 체크리스트 생성 요청: {}", request.getCampgroundName());
        try {
            CampingChecklistResponseDTO fullResponse = geminiService.generateCampingChecklist(request);
            if (fullResponse != null) {
                Map<String, Object> aiResponse = new HashMap<>();
                aiResponse.put("success", true);
                aiResponse.put("recommendations", fullResponse.getSpecialRecommendations());
                aiResponse.put("advice", fullResponse.getAiAdvice());
                return ResponseEntity.ok(aiResponse);
            } else {
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "error", "AI 응답을 생성하지 못했습니다."));
            }
        } catch (Exception e) {
            log.error("AI 전용 체크리스트 생성 중 오류", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of("success", false, "error", "서버 오류가 발생했습니다."));
        }
    }

    /**
     * API 상태 확인
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Camping Checklist API is running");
    }

    // --- 헬퍼 메서드들---
    private void setTemperatureBySeason(CampingChecklistRequestDTO request, String season) {
        switch (season) {
            case "봄": request.setMinTemperature(10); request.setMaxTemperature(20); break;
            case "여름": request.setMinTemperature(20); request.setMaxTemperature(30); break;
            case "가을": request.setMinTemperature(5); request.setMaxTemperature(15); break;
            case "겨울": request.setMinTemperature(-5); request.setMaxTemperature(5); break;
            default: request.setMinTemperature(15); request.setMaxTemperature(25); break;
        }
    }

    private CampingChecklistRequestDTO mapReservationToChecklistRequest(ReservationDTO reservation) {
        CampingChecklistRequestDTO request = new CampingChecklistRequestDTO();
        request.setCampgroundId(reservation.getCampgroundId());
        request.setCampgroundName(reservation.getCampgroundName());
        request.setAddrFull(reservation.getFullAddress());
        request.setAddrSido(reservation.getSido());
        request.setAddrSigungu(reservation.getSigungu());
        request.setCampgroundType(reservation.getCampgroundType());
        request.setZoneId(reservation.getZoneId());
        request.setZoneName(reservation.getZoneName());
        request.setZoneType(reservation.getZoneType());
        request.setZoneTerrainType(reservation.getZoneTerrainType());
        request.setCapacity(reservation.getCapacity());
        request.setCheckInDate(reservation.getCheckInDate());
        request.setCheckOutDate(reservation.getCheckOutDate());
        long days = ChronoUnit.DAYS.between(reservation.getCheckInDate(), reservation.getCheckOutDate());
        request.setDuration((int) days);
        request.setTotalPeople(reservation.getTotalPeople());
        request.setAdults(reservation.getAdults());
        request.setChildren(reservation.getChildren());
        request.setInfants(reservation.getInfants());
        request.setHasElectricity(reservation.isHasElectricity());
        request.setHasWater(reservation.isHasWater());
        request.setEnvironments(reservation.getEnvironments());
        return request;
    }
}
