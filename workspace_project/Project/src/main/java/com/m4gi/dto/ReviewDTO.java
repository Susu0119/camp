package com.m4gi.dto;

import java.time.LocalDateTime;

import lombok.Data;

//리뷰 작성용 DTO
@Data
public class ReviewDTO {
	private String reviewId;
    private int providerCode;
    private String providerUserId;
    private String campgroundId;
    private String reservationId;
    private int reviewRating;
    private String reviewContent;
    private String reviewPhotosJson;
    private LocalDateTime checkInTime;    // 예약 체크인 시간
    private LocalDateTime checkOutTime;   // 예약 체크아웃 시간
}
