package com.m4gi.mapper;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;

@Mapper
public interface ReviewMapper {

        // 리뷰 가능한 예약 조회
        List<ReservationForReviewDTO> selectCompletedReservationsWithoutReview(
                        @Param("providerCode") int providerCode,
                        @Param("providerUserId") String providerUserId,
                        @Param("completedStatus") int completedStatus);

        // 중복 여부 체크
        int countByReviewId(String reviewId);

        int countByReservationId(String reservationId);

        // 리뷰 등록
        int insertReview(ReviewDTO review);

        // 전체 최신 리뷰 페이징 조회
        List<ReviewDTO> selectRecentPublicReviews(
                        @Param("offset") int offset,
                        @Param("size") int size);

        // 로그인한 사용자 + 날짜 + 캠핑장 필터 리뷰 조회
        List<ReviewDTO> selectReviewsByUserAndFilter(
                        @Param("userId") String userId,
                        @Param("campgroundId") int campgroundId,
                        @Param("checkIn") LocalDateTime checkIn,
                        @Param("checkOut") LocalDateTime checkOut);

        ReviewDTO selectReviewById(String reviewId);

        // 리뷰 신고
        int insertReviewReport(Map<String, Object> params);

        // 리뷰 신고 중복 확인
        int existsReport(@Param("reviewId") String reviewId, @Param("providerCode") int providerCode,
                        @Param("providerUserId") String providerUserId);

        // 내가 쓴 리뷰 개수 반환
        int getMyReviewCount(@Param("providerCode") int providerCode, @Param("providerUserId") String providerUserId);

}
