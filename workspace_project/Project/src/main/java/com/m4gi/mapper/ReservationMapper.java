package com.m4gi.mapper;

import com.m4gi.dto.ReservationDTO;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface ReservationMapper {
	
	/* 신규 예약 */
    void insertReservation(ReservationDTO reservationDTO);
    
    /* 예약 번호 자동 증가 */
    String getLastReservationId();
    
}
