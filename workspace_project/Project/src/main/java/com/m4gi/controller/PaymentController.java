package com.m4gi.controller;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.mapper.PaymentMapper;
import com.m4gi.service.PaymentService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/payments")
public class PaymentController {

    @Autowired
    private PaymentService paymentService;

    @PostMapping
    public ResponseEntity<PaymentDTO> create(@RequestBody PaymentDTO dto) {
    	System.out.println("📌 [서버] 받은 결제 정보: " + dto);
        paymentService.createPayment(dto);
        return new ResponseEntity<>(dto, HttpStatus.CREATED);
    }
}
