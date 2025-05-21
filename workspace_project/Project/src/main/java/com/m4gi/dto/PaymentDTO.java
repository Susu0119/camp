package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data

public class PaymentDTO {

    /** PK – 결제 ID (가맹점 주문번호) */
    private String paymentId;

    /** FK – 연관된 예약 ID */
    private String reservationId;

    /** 실제 결제 금액(원) */
    private Integer paymentPrice;

    /** 1:카카오페이, 2:신용카드, 3:계좌이체 … */
    private Integer paymentMethod;

    /** 1:결제완료, 2:환불, 3:결제실패 등 */
    private Integer paymentStatus;

    /** PG사(포트원) 거래 번호 */
    private String pgTransactionId;

    /** 결제 완료 시각 */
    private LocalDateTime paidAt;

    /** 생성·수정 타임스탬프 (DB에서 자동 관리) */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
