// com.m4gi.dto.admin.ReservationDetailDTO
package com.m4gi.dto.admin;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class AdminReservationDetailDTO {
    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private String siteId;
    private String reservationDate;
    private String checkinDate;
    private String checkoutDate;
    private String reservationStatus;
    private String paymentStatus;

    private String cancelReason = "-";           // 취소 사유가 없으면 "-"
    private String refundStatus = "없음";         // 환불 상태 기본값

    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt; // 날짜 + 시간
}
