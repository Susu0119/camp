package com.m4gi.dto;

import java.util.Date;

import lombok.Data;

@Data
public class ReservationResponseDTO {
    // 예약 기본 정보 (필요한 필드들을 여기에 추가)
    private String reservationId;
    private String campgroundName;
    private String addrFull;
    private Date reservationDate;
    private Date endDate;
    private int totalPrice;
    private int reservationStatus;
    private int checkinStatus;

    // ✨ 핵심: 파싱된 최종 썸네일 이미지 URL 하나만 담을 필드
    private String campgroundThumbnailUrl;

    private Integer refundStatus;

    // 캠핑장 구역 정보
    private String zoneName;
    private String zoneType;

    // 예약 사이트 정보
    private String reservationSite; // site_id

    // 인원수 정보
    private Integer totalPeople; // 총 인원수

    private String cancelReason;
    private String customReason;
    


}
