package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminPaymentDTO;
import com.m4gi.service.admin.AdminPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final AdminPaymentService adminPaymentService;

    @GetMapping
    public ResponseEntity<List<AdminPaymentDTO>> getAllPayments() {
        return ResponseEntity.ok(adminPaymentService.findAllPayments());
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<AdminPaymentDTO> getPaymentByReservationId(@PathVariable String reservationId) {
        return ResponseEntity.ok(adminPaymentService.findPaymentByReservationId(reservationId));
    }


}
