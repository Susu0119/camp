package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;

public interface ReviewService {
	 // 리뷰 작성 가능한 예약 목록 가져오기
    List<ReservationForReviewDTO> getAvailableReservationsForReview(int providerCode, String providerUserId);

    // 리뷰 작성 저장
    boolean writeReview(ReviewDTO review);

}
