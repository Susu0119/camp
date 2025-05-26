package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.ReservationForReviewDTO;
import com.m4gi.dto.ReviewDTO;

@Mapper
public interface ReviewMapper {
	
	// 1) 로그인한 사용자가 완료한 예약 중 리뷰가 없는 예약 목록 조회
    List<ReservationForReviewDTO> selectCompletedReservationsWithoutReview(@Param("providerCode") int providerCode,
                                                                           @Param("providerUserId") String providerUserId,
                                                                           @Param("completedStatus") int completedStatus);

    // 2) 리뷰 저장
    int insertReview(ReviewDTO review);
    
}
