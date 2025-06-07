package com.m4gi.controller;

import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;
import com.m4gi.service.GeminiService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/camping-checklist")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@Slf4j
public class CampingChecklistController {

    private final GeminiService geminiService;

    /**
     * 맞춤형 캠핑 준비물 리스트 생성
     * 
     * @param request 캠핑 정보 및 조건
     * @return 생성된 캠핑 준비물 리스트
     */
    @PostMapping("/generate")
    public ResponseEntity<CampingChecklistResponseDTO> generateCampingChecklist(
            @RequestBody CampingChecklistRequestDTO request) {

        try {
            log.info("캠핑 준비물 리스트 생성 요청 - 캠핑장: {}, 인원: {}명",
                    request.getCampgroundName(), request.getTotalPeople());

            // 요청 데이터 검증
            if (request.getCampgroundName() == null || request.getCampgroundName().trim().isEmpty()) {
                return ResponseEntity.badRequest().build();
            }

            if (request.getTotalPeople() <= 0) {
                return ResponseEntity.badRequest().build();
            }

            // 숙박일수 자동 계산
            if (request.getDuration() == 0 && request.getCheckInDate() != null && request.getCheckOutDate() != null) {
                long days = ChronoUnit.DAYS.between(request.getCheckInDate(), request.getCheckOutDate());
                request.setDuration((int) days);
            }

            // Gemini API를 통해 맞춤형 준비물 리스트 생성
            CampingChecklistResponseDTO response = geminiService.generateCampingChecklist(request);

            if (response != null) {
                log.info("캠핑 준비물 리스트 생성 완료 - 카테고리 수: {}",
                        response.getCategories() != null ? response.getCategories().size() : 0);
                return ResponseEntity.ok(response);
            } else {
                log.error("캠핑 준비물 리스트 생성 실패");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
            }

        } catch (Exception e) {
            log.error("캠핑 준비물 리스트 생성 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).build();
        }
    }

    /**
     * 예약 ID 기반 캠핑 준비물 리스트 생성
     * 실제 예약 정보와 캠핑장 정보를 DB에서 조회하여 생성
     * 
     * @param reservationId 예약 ID
     * @param season        계절 (선택사항)
     * @param experience    캠핑 경험 (선택사항)
     * @param companions    동반자 정보 (선택사항)
     * @param activities    선호 활동 (선택사항)
     * @return 생성된 캠핑 준비물 리스트
     */
    @GetMapping("/generate-by-reservation")
    public ResponseEntity<CampingChecklistResponseDTO> generateChecklistByReservation(
            @RequestParam String reservationId,
            @RequestParam(required = false) String season,
            @RequestParam(defaultValue = "중급") String experience,
            @RequestParam(required = false) String companions,
            @RequestParam(required = false) String activities,
            @RequestParam(defaultValue = "자차") String transportation,
            @RequestParam(defaultValue = "중예산") String budget) {

        try {
            log.info("예약 기반 캠핑 준비물 리스트 생성 요청 - 예약 ID: {}", reservationId);

            // TODO: 실제 구현 시 예약 정보와 캠핑장 정보를 DB에서 조회
            // 현재는 예시 데이터로 구성
            CampingChecklistRequestDTO request = createSampleReservationRequest(reservationId);

            // 사용자 입력 정보 추가
            if (season != null) {
                request.setSeason(season);
                setTemperatureBySeason(request, season);
            }

            request.setExperience(experience);
            request.setTransportation(transportation);
            request.setBudget(budget);

            if (companions != null) {
                request.setCompanions(Arrays.asList(companions.split(",")));
            }

            if (activities != null) {
                request.setPreferredActivities(Arrays.asList(activities.split(",")));
            }

            CampingChecklistResponseDTO response = geminiService.generateCampingChecklist(request);

            if (response != null) {
                log.info("예약 기반 캠핑 준비물 리스트 생성 완료");
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
     * 간편 캠핑 준비물 리스트 생성 (최소 정보만으로)
     * 
     * @param campgroundName 캠핑장 이름
     * @param location       위치
     * @param totalPeople    총 인원수
     * @param season         계절
     * @param duration       숙박일수
     * @return 생성된 캠핑 준비물 리스트
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
            log.info("간편 캠핑 준비물 리스트 생성 요청 - 캠핑장: {}, 인원: {}명",
                    campgroundName, totalPeople);

            // 간단한 요청 객체 생성
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

            // 기본 온도 설정 (계절별)
            setTemperatureBySeason(request, season);

            CampingChecklistResponseDTO response = geminiService.generateCampingChecklist(request);

            if (response != null) {
                log.info("간편 캠핑 준비물 리스트 생성 완료");
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
     * API 상태 확인
     * 
     * @return API 상태
     */
    @GetMapping("/health")
    public ResponseEntity<String> healthCheck() {
        return ResponseEntity.ok("Camping Checklist API is running");
    }

    // 헬퍼 메서드들
    private void setTemperatureBySeason(CampingChecklistRequestDTO request, String season) {
        switch (season) {
            case "봄":
                request.setMinTemperature(10);
                request.setMaxTemperature(20);
                break;
            case "여름":
                request.setMinTemperature(20);
                request.setMaxTemperature(30);
                break;
            case "가을":
                request.setMinTemperature(5);
                request.setMaxTemperature(15);
                break;
            case "겨울":
                request.setMinTemperature(-5);
                request.setMaxTemperature(5);
                break;
            default:
                request.setMinTemperature(15);
                request.setMaxTemperature(25);
        }
    }

    // TODO: 실제 구현에서는 DB에서 예약 정보를 조회하는 서비스를 주입받아야 함
    private CampingChecklistRequestDTO createSampleReservationRequest(String reservationId) {
        CampingChecklistRequestDTO request = new CampingChecklistRequestDTO();

        // 예시 데이터 - 실제로는 DB에서 조회
        request.setCampgroundId(1);
        request.setCampgroundName("힐링캠프장");
        request.setAddrFull("경기도 가평군 청평면");
        request.setAddrSido("경기도");
        request.setAddrSigungu("가평군");
        request.setCampgroundType("AUTO");
        request.setZoneId(1000);
        request.setZoneName("A구역");
        request.setZoneType("오토캠핑");
        request.setZoneTerrainType("잔디");
        request.setCapacity(6);

        // 예약 정보
        request.setCheckInDate(LocalDate.now().plusDays(7)); // 1주일 후
        request.setCheckOutDate(LocalDate.now().plusDays(8)); // 1박 2일
        request.setDuration(1);
        request.setTotalPeople(4);
        request.setAdults(2);
        request.setChildren(2);
        request.setInfants(0);

        // 기본 시설 정보
        request.setHasElectricity(true);
        request.setHasWater(true);
        request.setEnvironments(Arrays.asList("MOUNTAIN", "VALLEY", "WATER_ACTIVITIES"));

        return request;
    }

    // AI 응답만 반환하는 엔드포인트
    @PostMapping("/generate-ai-only")
    public ResponseEntity<Map<String, Object>> generateAiOnlyChecklist(
            @RequestBody CampingChecklistRequestDTO request) {
        log.info("AI 전용 캠핑 체크리스트 생성 요청: {}", request.getCampgroundName());

        try {
            CampingChecklistResponseDTO fullResponse = geminiService.generateCampingChecklist(request);

            // AI 생성 부분만 추출
            Map<String, Object> aiOnlyResponse = new HashMap<>();
            aiOnlyResponse.put("categories", fullResponse.getCategories());
            aiOnlyResponse.put("specialRecommendations", fullResponse.getSpecialRecommendations());
            aiOnlyResponse.put("aiAdvice", fullResponse.getAiAdvice());
            aiOnlyResponse.put("generatedAt", fullResponse.getGeneratedAt());

            return ResponseEntity.ok(aiOnlyResponse);
        } catch (Exception e) {
            log.error("AI 전용 체크리스트 생성 중 오류 발생", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(Map.of("error", "체크리스트 생성에 실패했습니다: " + e.getMessage()));
        }
    }
}