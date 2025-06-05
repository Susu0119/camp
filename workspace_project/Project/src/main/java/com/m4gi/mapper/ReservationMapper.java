package com.m4gi.mapper;

import com.m4gi.dto.ReservationDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.time.LocalDate;
import java.util.List;

@Mapper
public interface ReservationMapper {
	
	/* 신규 예약 */
    void insertReservation(ReservationDTO reservationDTO);
    
    /* 예약 번호 자동 증가 */
    String getLastReservationId();

    /* 예약 날짜 다 찼을시 비활성화 */
    List<LocalDate> findFullyBookedDates(@Param("campgroundId") String campgroundId);
    
}
