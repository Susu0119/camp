package com.m4gi.dto.admin;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminPaymentDTO {

    private String paymentId;
    private String reservationId;
    private String campgroundName;
    private String userNickname;
    private int paymentPrice;
    private int paymentStatus;
    private Integer refundType;
    private Integer refundStatus;
    private LocalDateTime paidAt;

}
