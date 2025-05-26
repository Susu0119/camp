package com.m4gi.controller;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.service.PaymentService;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping(produces = "application/json; charset=UTF-8")
    public Map<String, Object> savePayment(@RequestBody PaymentDTO paymentDTO, HttpSession session) {
        Map<String, Object> response = new HashMap<>();

        try {
            // ✅ 로그인 정보 세션에서 꺼내기
            String providerUserId = (String) session.getAttribute("provider_user_id");
            Integer providerCode = (Integer) session.getAttribute("provider_code");

            // ✅ 로그인 세션이 없으면 테스트용 계정 사용
            if (providerUserId == null || providerCode == null) {
                System.out.println("⚠️ 세션 없음 → 테스트용 계정 사용");
                providerUserId = "puid_0010";
                providerCode = 1;
            }

            // ✅ 예약 정보 null 여부 확인
            ReservationDTO reservation = paymentDTO.getReservation();
            if (reservation == null) {
                response.put("success", false);
                response.put("message", "⛔ 예약 정보가 없습니다.");
                return response;
            }

            // ✅ 사용자 정보 주입
            reservation.setProviderUserId(providerUserId);
            reservation.setProviderCode(providerCode);
            reservation.setReservationStatus(1);

            // ✅ 결제 및 예약 저장
            paymentService.savePaymentAndReservation(paymentDTO);

            response.put("success", true);
            response.put("message", "✅ 결제 및 예약 정보 저장 완료");
        } catch (Exception e) {
            e.printStackTrace(); // 🔍 서버 콘솔에 전체 예외 로그 출력
            response.put("success", false);
            response.put("message", "❌ 서버 저장 실패: " + e.getMessage());
        }

        return response;
    }
}
