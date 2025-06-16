package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.ReservationAlertDTO; 

@Mapper
public interface ReservationAlertMapper {

	// 예약 완료된 건들을 조회 (알림 생성을 위한 데이터)
    List<ReservationAlertDTO> selectCompletedReservationsForAlerts(@Param("providerCode") Integer providerCode, @Param("providerUserId") String providerUserId);

	// 예약 취소된 건들을 조회 (알림 생성을 위한 데이터)
    List<ReservationAlertDTO> selectCanceledReservationsForAlerts(@Param("providerCode") Integer providerCode, @Param("providerUserId") String providerUserId);

}