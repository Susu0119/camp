package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminPaymentDetailDTO;
import com.m4gi.service.admin.AdminPaymentService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/admin/payments")
@RequiredArgsConstructor
public class AdminPaymentController {

    private final AdminPaymentService adminPaymentService;

    @GetMapping
    public ResponseEntity<List<AdminPaymentDetailDTO>> getAllPayments(
            @RequestParam(required = false) Integer reservationStatus,
            @RequestParam(required = false) Integer paymentStatus,
            @RequestParam(defaultValue = "DESC") String sortOrder
    ) {
        return ResponseEntity.ok(
                adminPaymentService.findAllPayments(reservationStatus, paymentStatus, sortOrder));
    }

    @GetMapping("/{reservationId}")
    public ResponseEntity<AdminPaymentDetailDTO> getPaymentByReservationId(@PathVariable String reservationId) {
        return ResponseEntity.ok(adminPaymentService.findPaymentByReservationId(reservationId));
    }


}
