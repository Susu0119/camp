package com.m4gi.service;

import java.util.List;
import com.m4gi.mapper.ReviewMapper;
import java.util.UUID;

import org.springframework.stereotype.Service;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService{
	private final ReviewMapper reviewMapper;

    // 예약 완료 상태를 상수로 선언
    private static final int RESERVATION_COMPLETED_STATUS = 3;

    @Override
    public List<ReservationForReviewDTO> getAvailableReservationsForReview(int providerCode, String providerUserId) {
        return reviewMapper.selectCompletedReservationsWithoutReview(providerCode, providerUserId, RESERVATION_COMPLETED_STATUS);
    }

    @Override
    public boolean writeReview(ReviewDTO review) {
        // reviewId는 UUID 등으로 생성해서 넣어야 함
        review.setReviewId(UUID.randomUUID().toString());

        int result = reviewMapper.insertReview(review);
        return result == 1;
    }
}
