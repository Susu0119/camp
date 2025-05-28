package com.m4gi.dto.admin;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminPaymentDTO {
    private String paymentId;
    private String reservationId;
    private String userNickname;
    private String userPhone;
    private String campgroundName;
    private String reservationSite;
    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;
    private int reservationStatus;
    private Integer refundStatus;
    private String cancelReason;
    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt;
    private int paymentPrice;
    private int paymentMethod;
    private int paymentStatus;
    private LocalDateTime paidAt;

}
