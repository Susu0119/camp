package com.m4gi.service;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.web.multipart.MultipartFile;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.dto.ReviewReportRequestDTO;
import com.m4gi.dto.UserDTO;

public interface ReviewService {

    // 리뷰 작성 가능한 예약 목록 가져오기
    List<ReservationForReviewDTO> getAvailableReservationsForReview(int providerCode, String providerUserId);

    // 리뷰 작성 저장
    boolean writeReview(ReviewDTO review);

    // 리뷰 신고
    boolean reportReview(ReviewReportRequestDTO dto, UserDTO user);

    String uploadReviewImage(MultipartFile file, String fileName) throws IOException;

    // 전체 유저 리뷰 불러오기(초기 진입용)
    List<ReviewDTO> getRecentPublicReviews(int page, int size);

    // 로그인한 사용자의 리뷰 + 날짜 + 캠핑장 필터로 검색
    List<ReviewDTO> getReviewsByUserAndFilter(String userId, int campgroundId, LocalDateTime checkIn,
            LocalDateTime checkOut);

    ReviewDTO getReviewById(String reviewId);

}
