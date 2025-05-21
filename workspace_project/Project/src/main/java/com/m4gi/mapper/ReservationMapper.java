package com.m4gi.mapper;

import com.m4gi.dto.ReservationDTO;   


public interface ReservationMapper {

    /** 신규 예약 INSERT */
    int insert(ReservationDTO dto);
}
