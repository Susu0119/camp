package com.m4gi.dto;

import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class ReservationDTO {

    /** PK – 예약 ID */
    private String reservationId;

    /** 소셜(카카오·네이버 등) 구분 코드 */
    private Integer providerCode;

    /** 소셜 측 사용자 ID */
    private String providerUserId;

    /** 예약한 사이트(캠핑 구역) */
    private String reservationSite;

    /** 입실/퇴실 날짜 */
    private LocalDate reservationDate;  // 입실일
    private LocalDate endDate;          // 퇴실일

    /** 예약 상태 (1:예약완료, 2:취소됨 등) */
    private Integer reservationStatus;

    /** 총 결제 금액 */
    private Integer totalPrice;

    /** 체크인/체크아웃 시간 */
    private String checkinTime;
    private String checkoutTime;

    /** QR 코드 */
    private String qrCode;

    /** 취소 사유 */
    private String cancelReason;

    /** 환불 상태 (1:진행중, 2:완료 등) */
    private Integer refundStatus;

    /** 환불 요청 및 완료 시각 */
    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt;

    /** 생성·수정 타임스탬프 (DB 자동관리) */
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    private int campgroundId;
    private String campgroundName;
    private String fullAddress;
    private String sido;
    private String sigungu;
    private String campgroundType;
    private int zoneId;
    private String zoneName;
    private String zoneType;
    private String zoneTerrainType;
    private int capacity;
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int totalPeople;
    private int adults;
    private int children;
    private int infants;
    private boolean hasElectricity;
    private boolean hasWater;
    private List<String> environments;
}
