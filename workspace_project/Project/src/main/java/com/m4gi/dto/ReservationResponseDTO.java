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
}
