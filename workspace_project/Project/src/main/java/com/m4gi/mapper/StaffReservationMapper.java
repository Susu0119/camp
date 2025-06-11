package com.m4gi.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.StaffReservationDTO;

@Mapper
public interface StaffReservationMapper {
	
	// 캠핑장 관계자 - 소유 캠핑장의 예약만 조회 
	List<StaffReservationDTO> selectReservationsByOwnerAndDate(
		    @Param("providerCode") int providerCode,
		    @Param("providerUserId") String providerUserId,
		    @Param("startDate") LocalDate startDate,
		    @Param("endDate") LocalDate endDate
		);

	
	// 캠핑장 관계자 - 체크인 처리
	int checkInReservation(@Param("reservationId") String reservationId);
	
	// 캠핑장 관계자 - 수동 퇴실 처리
	int checkOutReservation(@Param("reservationId") String reservationId);
	
	// 캠핑장 관계자 - 자동 퇴실 처리
	int autoCheckoutReservations();
};
