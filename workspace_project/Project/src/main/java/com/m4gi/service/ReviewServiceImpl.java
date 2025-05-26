package com.m4gi.service;

import java.time.LocalDateTime;

import java.util.List;
import com.m4gi.mapper.ReviewMapper;
import java.util.UUID;

import org.apache.ibatis.annotations.Param;
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

    // 리뷰 가능한 예약 목록
    @Override
    public List<ReservationForReviewDTO> getAvailableReservationsForReview(int providerCode, String providerUserId) {
        return reviewMapper.selectCompletedReservationsWithoutReview(providerCode, providerUserId, RESERVATION_COMPLETED_STATUS);
    }

    // 리뷰 저장
    @Override
    public boolean writeReview(ReviewDTO review) {
        review.setReviewId(UUID.randomUUID().toString());
        int result = reviewMapper.insertReview(review);
        return result == 1;
    }

    // 최신 공개 리뷰 페이징 조회
    @Override
    public List<ReviewDTO> getRecentPublicReviews(int offset, int size) {
        return reviewMapper.selectRecentPublicReviews(offset, size);
    }

    // 로그인한 사용자의 리뷰 + 필터 조건
    @Override
    public List<ReviewDTO> getReviewsByUserAndFilter(String userId, String campgroundId, LocalDateTime checkIn, LocalDateTime checkOut) {
        return reviewMapper.selectReviewsByUserAndFilter(userId, campgroundId, checkIn, checkOut);
    }
    
}
