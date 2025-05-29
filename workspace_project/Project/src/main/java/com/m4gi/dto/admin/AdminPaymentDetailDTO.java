package com.m4gi.dto.admin;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminPaymentDetailDTO {
    private String userNickname;
    private int reservationStatus;
    private Integer refundStatus;
    private String cancelReason;
    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt;
    private LocalDateTime paidAt;
    private int paymentPrice;
    private int paymentMethod;
    private int paymentStatus;
    private Integer refundAmount;
    private Integer feeAmount;
    private String refundType;

}
