package com.m4gi.controller;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.PaymentService;
import com.m4gi.service.UserService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
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

            // ✅ 세션에서 사용자 정보 가져오기 (다른 컨트롤러와 동일한 방식)
            UserDTO loginUser = (UserDTO) session.getAttribute("loginUser");
            if (loginUser == null) {
                response.put("success", false);
                response.put("message", "⛔ 로그인이 필요합니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            Integer providerCode = (Integer) session.getAttribute("providerCode");
            String providerUserId = (String) session.getAttribute("providerUserId");

            if (providerCode == null || providerUserId == null) {
                response.put("success", false);
                response.put("message", "⛔ 사용자 정보가 없습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            // ✅ 사용자 상태 확인
            UserDTO user = userService.getUserByProvider(providerCode, providerUserId);
            if (user == null) {
                response.put("success", false);
                response.put("message", "⛔ 회원 정보가 존재하지 않습니다.");
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
            }

            if (user.getUserStatus() == null || user.getUserStatus() != 0) {
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

            // ✅ 세션의 사용자 정보 주입
            reservation.setProviderUserId(providerUserId);
            reservation.setProviderCode(providerCode);
            reservation.setReservationStatus(1);

            System.out.println("✅ 예약 정보 확인: " + reservation);

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
            paymentService.savePaymentAndReservation(paymentDTO);

            // 🔍 저장 후 재검증 (트랜잭션 커밋 확인용)
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

            // ✅ 테스트용 기본값 설정
            if (reservation.getProviderUserId() == null) {
                reservation.setProviderUserId("test_user_" + System.currentTimeMillis());
            }
            if (reservation.getProviderCode() == null) {
                reservation.setProviderCode(1);
            }
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
            paymentService.savePaymentAndReservation(paymentDTO);

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
