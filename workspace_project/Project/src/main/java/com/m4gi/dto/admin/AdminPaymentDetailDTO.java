package com.m4gi.dto.admin;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminPaymentDetailDTO {
    private String paymentId;
    private String reservationId;
    private String userNickname;
    private int reservationStatus;
    private String campgroundName;
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
    private String userPhone;
    private String reservationSite;
    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;

}
