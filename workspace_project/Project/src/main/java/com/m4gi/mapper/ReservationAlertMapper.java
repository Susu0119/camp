package com.m4gi.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface ReservationAlertMapper {

	//예약 완료된 건들을 조회 (알림 생성을 위한 데이터)
    List<Map<String, Object>> selectCompletedReservationsForAlerts(@Param("providerCode") Integer providerCode, @Param("providerUserId") String providerUserId);

	//예약 취소된 건들을 조회 (알림 생성을 위한 데이터)
    List<Map<String, Object>> selectCanceledReservationsForAlerts(@Param("providerCode") Integer providerCode, @Param("providerUserId") String providerUserId);

}
