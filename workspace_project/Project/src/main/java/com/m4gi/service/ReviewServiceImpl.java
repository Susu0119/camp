package com.m4gi.service;

import java.time.LocalDateTime;
import java.util.List;
import java.util.UUID;

import org.springframework.dao.DuplicateKeyException;
import org.springframework.stereotype.Service;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.mapper.ReviewMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ReviewServiceImpl implements ReviewService {

    private final ReviewMapper reviewMapper;

    // 예약 완료 상태를 상수로 선언
    private static final int RESERVATION_COMPLETED_STATUS = 3;

    // 1. 리뷰 가능한 예약 목록 조회
    @Override
    public List<ReservationForReviewDTO> getAvailableReservationsForReview(int providerCode, String providerUserId) {
        return reviewMapper.selectCompletedReservationsWithoutReview(providerCode, providerUserId, RESERVATION_COMPLETED_STATUS);
    }

    // 2. 리뷰 저장
    @Override
    public boolean writeReview(ReviewDTO review) {

        // 1. reviewId가 없는 경우 자동 생성
        if (review.getReviewId() == null || review.getReviewId().isEmpty()) {
            // "rev_" + UUID 앞 8자리 조합
            String generatedId = "rev_" + UUID.randomUUID().toString().substring(0, 8);
            review.setReviewId(generatedId);
        }

        // 2. reservationId로 중복 리뷰 체크
        int countByReservation = reviewMapper.countByReservationId(review.getReservationId());
        if (countByReservation > 0) {
            // 사용자에게 reservationId는 노출하지 않도록 메시지 간소화
            throw new IllegalStateException("이미 해당 예약에 대한 리뷰가 존재합니다.");
        }

        // 3. reviewId 중복 여부 체크 (혹시 모를 경우 대비)
        int countByReviewId = reviewMapper.countByReviewId(review.getReviewId());
        if (countByReviewId > 0) {
            throw new DuplicateKeyException("이미 존재하는 리뷰 ID입니다.");
        }

        // 4. 리뷰 삽입 수행
        int result = reviewMapper.insertReview(review);
        return result == 1;
    }

    // 3. 최신 공개 리뷰 페이징 조회
    @Override
    public List<ReviewDTO> getRecentPublicReviews(int offset, int size) {
        return reviewMapper.selectRecentPublicReviews(offset, size);
    }

    // 4. 로그인한 사용자의 리뷰 + 필터 조건으로 조회
    @Override
    public List<ReviewDTO> getReviewsByUserAndFilter(String userId, String campgroundId, LocalDateTime checkIn, LocalDateTime checkOut) {
        return reviewMapper.selectReviewsByUserAndFilter(userId, campgroundId, checkIn, checkOut);
    }
}
