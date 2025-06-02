package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO;

@Mapper
public interface UserMypageReservationsMapper {
	
	//예약 중인 목록 조회 (로그인 사용자 기준) 
	List<UserMypageReservationsDTO>  selectOngoingReservations(
			@Param("providerCode") int providerCode,
            @Param("providerUserId") String providerUserId);
	
	//예약 취소 처리 
	int updateReservationCancel(
		    @Param("reservationId") String reservationId,
		    @Param("cancelReason") String cancelReason,
		    @Param("refundStatus") int refundStatus,
		    @Param("requestedAt") java.sql.Timestamp requestedAt
		);
	
	//예약 취소/환불 내역 조회
	 List<CanceledReservationsDTO> getCanceledReservations(
		        @Param("providerCode") int providerCode,
		        @Param("providerUserId") String providerUserId
		    );


}