package com.m4gi.dto;

import java.time.LocalDateTime;

import lombok.Data;

// 리뷰 작성 및 조회용 DTO
@Data
public class ReviewDTO {
    private String reviewId;            // 리뷰 ID, UUID 형태
    private int providerCode;           // 리뷰 작성자 제공자 코드
    private String providerUserId;      // 리뷰 작성자 사용자 ID
    private String campgroundId;        // 캠핑장 ID (필터링용)
    private String reservationId;       // 예약 ID (중복 리뷰 체크용)
    private String siteName;			// 사이트명 - 캠핑장 구역용
    private int reviewRating;           // 별점 점수 (예: 1~5)
    private String reviewContent;       // 리뷰 내용
    private String reviewPhotosJson;    // 리뷰 사진 URL JSON 문자열
    
    private LocalDateTime checkInTime;  // 예약 체크인 시간 (필터용)
    private LocalDateTime checkOutTime; // 예약 체크아웃 시간 (필터용)

    private LocalDateTime createdAt;    // 리뷰 작성 시간 (추가 가능)
    private LocalDateTime updatedAt;    // 리뷰 수정 시간 (추가 가능)
    
    
}
