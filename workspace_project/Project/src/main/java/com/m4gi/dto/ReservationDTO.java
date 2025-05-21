package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data

public class ReservationDTO {

    /* PK – 예약 ID */
    private String reservationId;

    /* 소셜(카카오·네이버 등) 구분 코드 */
    private Integer providerCode;

    /* 소셜 측 사용자 ID */
    private String providerUserId;

    /* 예약한 사이트(캠핑 구역) 번호 */
    private String reservationSite;

    /* 입실 날짜 · 퇴실 날짜 */
    private LocalDate reservationDate;
    private LocalDate endDate;

    /** 1:예약완료, 2:취소 */
    private Integer reservationStatus;

    /** 총 결제 예정 금액(원) */
    private Integer totalPrice;

    /* 체크인·체크아웃 실제 시각 */
    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;

    /* 현장 QR 코드 (URL 또는 토큰) */
    private String qrCode;

    /* 환불 사유 (취소 시) */
    private String refundReason;

    /* 1:진행 중, 2:환불 완료 */
    private Integer refundStatus;

    /* 환불 요청·완료 시각 */
    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt;

    /* 생성·수정 타임스탬프 (DB에서 자동 관리) */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
