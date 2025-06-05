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

            // ✅ 테스트용 계정으로 강제 설정 (UserController 와 동일하게 통일)
            String providerUserId = "puid_0019";
            Integer providerCode = 1;

            System.out.println("📦 전달받은 paymentDTO: " + paymentDTO);

            // ✅ 이전 세션 방식 주석 처리 (임시 미사용)
            /*
            String providerUserId = (String) session.getAttribute("provider_user_id");
            Integer providerCode = (Integer) session.getAttribute("provider_code");

            if (providerUserId == null || providerCode == null) {
                System.out.println("⚠️ 세션 없음 → 테스트 계정 사용");
                providerUserId = "puid_0010";
                providerCode = 1;
            }
            */

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

            // ✅ 사용자 정보 주입
            reservation.setProviderUserId(providerUserId);
            reservation.setProviderCode(providerCode);
            reservation.setReservationStatus(1);

            System.out.println("✅ 예약 정보 확인: " + reservation);

            // ✅ 결제 + 예약 저장 처리
            paymentService.savePaymentAndReservation(paymentDTO);

            response.put("success", true);
            response.put("message", "✅ 결제 및 예약 정보 저장 완료");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace(); // 🔍 서버 로그에 예외 출력
            response.put("success", false);
            response.put("message", "❌ 서버 오류: " + e.getMessage());
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
        }
    }
}
