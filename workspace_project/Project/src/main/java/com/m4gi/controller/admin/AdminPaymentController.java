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
            @RequestParam(required = false) Integer approvalStatus,
            @RequestParam(defaultValue = "DESC") String sortOrder,
            @RequestParam(required = false) String keyword,
            @RequestParam(required = false) String startDate,
            @RequestParam(required = false) String endDate
    ) {
        return ResponseEntity.ok(
                adminPaymentService.findAllPayments(reservationStatus, paymentStatus, approvalStatus, sortOrder, keyword, startDate, endDate));
    }

    @GetMapping("/{paymentId}")
    public ResponseEntity<AdminPaymentDetailDTO> getPaymentByPaymentId(@PathVariable String paymentId) {
        return ResponseEntity.ok(adminPaymentService.findPaymentByPaymentId(paymentId));
    }

}
