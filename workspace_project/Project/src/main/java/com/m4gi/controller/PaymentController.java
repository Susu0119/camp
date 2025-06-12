package com.m4gi.controller;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.UserDTO; // UserDTO 임포트 추가
import com.m4gi.service.PaymentService;
import com.m4gi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*; // @RequestBody, @RequestMapping 등 사용

import javax.servlet.http.HttpSession; // HttpSession 사용

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private UserService userService;

    @PostMapping(produces = "application/json; charset=UTF-8")
    public ResponseEntity<Map<String, Object>> savePayment(@RequestBody PaymentDTO paymentDTO, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("📦 paymentDTO: " + paymentDTO);
            System.out.println("📌 예약: " + paymentDTO.getReservation());
            
            // ✅ 세션에서 사용자 정보 가져오기
            // 먼저 세션에서 loginUser를 가져와 유효성 검사합니다.
            UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
            if (loginUser == null) {
                response.put("success", false);
                response.put("message", "⛔ 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 추가적인 providerCode와 providerUserId 세션 속성 검사 (loginUser에서 가져오는 것이 더 일관적일 수 있음)
            // 여기서는 기존 코드 흐름을 유지합니다.
            Integer sessionProviderCode = (Integer) session.getAttribute("providerCode");
            String sessionProviderUserId = (String) session.getAttribute("providerUserId");

            if (sessionProviderCode == null || sessionProviderUserId == null) {
                response.put("success", false);
                response.put("message", "⛔ 세션에 사용자 정보가 없습니다."); // 또는 "⛔ 사용자 정보가 불완전합니다."
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // 중복 결제 차단
            String resvId = paymentDTO.getReservation().getReservationId();
            boolean alreadyPaid = paymentService.existsByReservationId(resvId);
            if (alreadyPaid) {
                response.put("success", false);
                response.put("message", "⛔ 이미 결제된 예약입니다.");
                return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(response);
            }
            
            // ✅ 사용자 상태 확인 (loginUser의 정보를 사용하는 것이 더 정확합니다.)
            // getUserbByProvider 호출 시 loginUser의 providerCode와 providerUserId를 사용하는 것이 좋습니다.
            UserDTO user = userService.getUserByProvider(loginUser.getProviderCode(), loginUser.getProviderUserId());
            if (user == null) {
                response.put("success", false);
                response.put("message", "⛔ 회원 정보가 존재하지 않습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (user.getUserStatus() == null || user.getUserStatus() != 0) { // userStatus 0이 정상인 경우
                response.put("success", false);
                response.put("message", "⛔ 해당 계정은 예약이 제한되어 있습니다.");
                return ResponseEntity.status(HttpStatus.FORBIDDEN).body(response);
            }

            // ✅ 예약 정보 null 여부 확인
            ReservationDTO reservation = paymentDTO.getReservation();
            System.out.println("🏕️ 예약 정보: " + reservation);

            if (reservation == null) {
                response.put("success", false);
                response.put("message", "⛔ 예약 정보가 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // ✅ checkinTime, checkoutTime null 또는 빈 문자열 방어
            String checkinTime = reservation.getCheckinTime();
            String checkoutTime = reservation.getCheckoutTime();

            if (checkinTime == null || checkoutTime == null || checkinTime.isBlank() || checkoutTime.isBlank()) {
                response.put("success", false);
                response.put("message", "⛔ 체크인 또는 체크아웃 시간이 누락되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("📌 checkinTime: " + checkinTime);
            System.out.println("📌 checkoutTime: " + checkoutTime);

            // ✅ 세션의 사용자 정보 주입 (reservation DTO에)
            // 이미 loginUser에서 providerCode, providerUserId를 가져왔으므로,
            // loginUser의 정보를 reservation에 직접 설정하는 것이 더 일관적입니다.
            reservation.setProviderUserId(loginUser.getProviderUserId());
            reservation.setProviderCode(loginUser.getProviderCode());
            reservation.setReservationStatus(1); // 예약 상태 1로 설정 (완료/진행 중 의미)

            System.out.println("✅ 예약 정보 최종 확인: " + reservation);

            // 🔍 날짜 검증
            if (reservation.getReservationDate() == null || reservation.getEndDate() == null) {
                response.put("success", false);
                response.put("message", "⛔ 예약 날짜가 누락되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            if (reservation.getReservationDate().isAfter(reservation.getEndDate())) {
                response.put("success", false);
                response.put("message", "⛔ 시작일이 종료일보다 늦을 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 🔍 남은 자리 검증 (실제 DB 조회)
            String siteId = reservation.getReservationSite();
            String startDate = reservation.getReservationDate().toString();
            String endDate = reservation.getEndDate().toString();

            // 사이트 ID로 구역 ID 찾기
            Integer zoneId = paymentService.getZoneIdBySiteId(siteId);
            if (zoneId == null) {
                response.put("success", false);
                response.put("message", "⛔ 유효하지 않은 사이트입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 남은 자리 검증
            boolean hasAvailableSpots = paymentService.validateAvailableSpots(zoneId, startDate, endDate);
            if (!hasAvailableSpots) {
                response.put("success", false);
                response.put("message", "⛔ 선택한 날짜에 예약 가능한 자리가 없습니다. 다른 날짜를 선택해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("✅ 남은 자리 검증 통과 - 구역: " + zoneId + ", 사이트: " + siteId);

            // ✅ 결제 + 예약 저장 처리
            // PaymentServiceImpl의 savePaymentAndReservation 메서드에 loginUser 객체를 전달합니다.
            paymentService.savePaymentAndReservation(paymentDTO, loginUser); // <<--- 이 부분 수정됨

            // 🔍 저장 후 재검증 (트랜잭션 커밋 확인용)
            // 이 재검증 로직은 동시성 문제가 없다면 일반적으로 필요하지 않지만,
            // 테스트 또는 특정 시나리오를 위해 남겨두신 것으로 보입니다.
            boolean hasAvailableSpotsAfter = paymentService.validateAvailableSpots(zoneId, startDate, endDate);
            System.out.println("📈 저장 후 남은 자리 있음: " + hasAvailableSpotsAfter);

            response.put("success", true);
            response.put("message", "✅ 결제 및 예약 정보 저장 완료");
            // ✅ 생성된 ID들을 응답에 포함
            response.put("reservationId", paymentDTO.getReservation().getReservationId());
            response.put("paymentId", paymentDTO.getPaymentId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // 🔍 서버 로그에 예외 출력
            response.put("success", false);
            response.put("message", "❌ 서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }

    // ⚡ 동시성 테스트용 엔드포인트 (세션 체크 우회)
    // 이 메서드는 사용자 정보가 필요 없을 수 있지만, 만약 알림을 생성한다면
    // 테스트 사용자 정보를 만들어서라도 service 메서드에 전달해야 합니다.
    @PostMapping(value = "/test", produces = "application/json; charset=UTF-8")
    public ResponseEntity<Map<String, Object>> savePaymentTest(@RequestBody PaymentDTO paymentDTO) {
        Map<String, Object> response = new HashMap<>();

        try {
            System.out.println("🧪 [테스트] paymentDTO: " + paymentDTO);
            System.out.println("🧪 [테스트] 예약: " + paymentDTO.getReservation());

            // ✅ 예약 정보 null 여부 확인
            ReservationDTO reservation = paymentDTO.getReservation();
            if (reservation == null) {
                response.put("success", false);
                response.put("message", "⛔ [테스트] 예약 정보가 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // ✅ checkinTime, checkoutTime null 또는 빈 문자열 방어
            String checkinTime = reservation.getCheckinTime();
            String checkoutTime = reservation.getCheckoutTime();

            if (checkinTime == null || checkoutTime == null || checkinTime.isBlank() || checkoutTime.isBlank()) {
                response.put("success", false);
                response.put("message", "⛔ [테스트] 체크인 또는 체크아웃 시간이 누락되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // ✅ 테스트용 기본값 설정 (UserDTO를 생성하여 서비스에 전달)
            UserDTO testUser = new UserDTO();
            if (reservation.getProviderUserId() == null) {
                testUser.setProviderUserId("test_user_" + System.currentTimeMillis());
                reservation.setProviderUserId(testUser.getProviderUserId()); // ReservationDTO에도 설정
            } else {
                testUser.setProviderUserId(reservation.getProviderUserId());
            }
            if (reservation.getProviderCode() == null) {
                testUser.setProviderCode(1);
                reservation.setProviderCode(testUser.getProviderCode()); // ReservationDTO에도 설정
            } else {
                testUser.setProviderCode(reservation.getProviderCode());
            }
            // 기타 UserDTO 필드 설정 (필요시)
            // testUser.setUserName("테스트 사용자");
            // testUser.setUserStatus(0); // 정상 상태 가정
            
            reservation.setReservationStatus(1);

            System.out.println("🧪 [테스트] 예약 정보 확인: " + reservation);

            // 🔍 [테스트] 날짜 검증
            if (reservation.getReservationDate() == null || reservation.getEndDate() == null) {
                response.put("success", false);
                response.put("message", "⛔ [테스트] 예약 날짜가 누락되었습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            if (reservation.getReservationDate().isAfter(reservation.getEndDate())) {
                response.put("success", false);
                response.put("message", "⛔ [테스트] 시작일이 종료일보다 늦을 수 없습니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 🔍 [테스트] 남은 자리 검증 (실제 DB 조회)
            String siteId = reservation.getReservationSite();
            String startDate = reservation.getReservationDate().toString();
            String endDate = reservation.getEndDate().toString();

            // 사이트 ID로 구역 ID 찾기
            Integer zoneId = paymentService.getZoneIdBySiteId(siteId);
            if (zoneId == null) {
                response.put("success", false);
                response.put("message", "⛔ [테스트] 유효하지 않은 사이트입니다.");
                return ResponseEntity.badRequest().body(response);
            }

            // 남은 자리 검증
            boolean hasAvailableSpots = paymentService.validateAvailableSpots(zoneId, startDate, endDate);
            if (!hasAvailableSpots) {
                response.put("success", false);
                response.put("message", "⛔ [테스트] 선택한 날짜에 예약 가능한 자리가 없습니다. 다른 날짜를 선택해주세요.");
                return ResponseEntity.badRequest().body(response);
            }

            System.out.println("✅ [테스트] 남은 자리 검증 통과 - 구역: " + zoneId + ", 사이트: " + siteId);

            // ✅ 결제 + 예약 저장 처리
            // PaymentServiceImpl의 savePaymentAndReservation 메서드에 테스트 사용자 객체를 전달합니다.
            paymentService.savePaymentAndReservation(paymentDTO, testUser); // <<--- 이 부분 수정됨

            // 🔍 [테스트] 저장 후 재검증 (트랜잭션 커밋 확인용)
            boolean hasAvailableSpotsAfter = paymentService.validateAvailableSpots(zoneId, startDate, endDate);
            System.out.println("📈 [테스트] 저장 후 남은 자리 있음: " + hasAvailableSpotsAfter);

            response.put("success", true);
            response.put("message", "🧪 테스트 결제 및 예약 정보 저장 완료");
            response.put("reservationId", paymentDTO.getReservation().getReservationId());
            response.put("paymentId", paymentDTO.getPaymentId());
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            response.put("success", false);
            response.put("message", "❌ 테스트 서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}