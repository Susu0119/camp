package com.m4gi.mapper;

import com.m4gi.dto.ReservationDTO;
import org.apache.ibatis.annotations.Mapper;

import java.util.Map;

@Mapper
public interface ReservationMapper {

    /* 신규 예약 */
    void insertReservation(ReservationDTO reservationDTO);

    /* 예약 번호 자동 증가 - 더 이상 사용하지 않음 (랜덤 문자열로 변경) */
    // String getLastReservationId();

    boolean existsReservationConflict(Map<String, Object> param);

}
