package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.ReservationAlertDTO;

@Mapper
public interface ReservationAlertMapper {

 /**
  * 특정 사용자에게 해당하는 예약 알림을 동적으로 생성하여 조회합니다.
  * 이 메소드는 'reservations', 'campground_sites', 'campgrounds' 테이블을 조인하여
  * 알림 메시지를 구성하는 데 필요한 모든 정보를 가져옵니다.
  *
  * @param providerCode 사용자의 providerCode
  * @param providerUserId 사용자의 providerUserId
  * @return 동적으로 생성된 예약 알림 목록 (ReservationAlertDTO)
  */
 List<ReservationAlertDTO> selectUserReservationAlerts(
     @Param("providerCode") int providerCode,
     @Param("providerUserId") String providerUserId
 );
}