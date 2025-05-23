package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminReservationDetailDTO {

    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private String siteId;
    private String reservationDate;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    private String reservationStatus;
    private String paymentStatus;

    private String cancelReason = "-";       // 취소 사유 없을 경우 기본값
    private String refundStatus = "없음";     // 환불 상태 기본값

    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt;        // 환불일시 (nullable)
}
