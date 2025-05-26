package com.m4gi.dto;

import lombok.Data;

//리뷰 작성용 DTO
@Data
public class ReviewDTO {
	private String reviewId;             // UUID 등 생성해서 저장
    private int providerCode;
    private String providerUserId;
    private String campgroundId;
    private String reservationId;
    private int reviewRating;            // 평점 1~5
    private String reviewContent;        // 내용
    private String reviewPhotosJson;     // 사진 여러 장 JSON 문자열 (옵션)
}
