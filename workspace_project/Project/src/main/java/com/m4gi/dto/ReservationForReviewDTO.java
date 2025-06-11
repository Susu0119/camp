package com.m4gi.dto;

import java.time.LocalDate;

import lombok.Data;

//이용 완료된 예약 중 리뷰 작성 가능한 예약 정보용 DTO
@Data
public class ReservationForReviewDTO {
	private String reservationId;
	private int campgroundId;
	private String campgroundName; // 이용 장소 (캠핑장명)
	private String siteName; // 이용 장소 (사이트명)
	private LocalDate reservationDate; // 이용 날짜
	private LocalDate endDate; // 종료 날짜
}
