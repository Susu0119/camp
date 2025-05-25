package com.m4gi.controller;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public String savePayment(@RequestBody PaymentDTO paymentDTO) {
        paymentService.savePaymentAndReservation(paymentDTO);
        return "결제 및 예약 정보 저장 완료";
    }
}
