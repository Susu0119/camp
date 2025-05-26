package com.m4gi.controller;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.service.PaymentService;

import javax.servlet.http.HttpSession;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public String savePayment(@RequestBody PaymentDTO paymentDTO,
                              HttpSession session) {
        //  로그인한 사용자 정보 세션에서 꺼내기
        String providerUserId = (String) session.getAttribute("provider_user_id");
        Integer providerCode = (Integer) session.getAttribute("provider_code");

        if (providerUserId == null || providerCode == null) {
            return "로그인 정보가 없습니다.";
        }

        //  DTO에 사용자 정보 주입
        paymentDTO.getReservation().setProviderUserId(providerUserId);
        paymentDTO.getReservation().setProviderCode(providerCode);

        // ✅ 서비스 호출
        paymentService.savePaymentAndReservation(paymentDTO);

        return "결제 및 예약 정보 저장 완료";
    }
}
