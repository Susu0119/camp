package com.m4gi.mapper;

import com.m4gi.dto.ReservationDTO;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;


@Mapper
public interface ReservationMapper {

    /* 신규 예약 */
    void insertReservation(ReservationDTO reservationDTO);

    /* 예약 번호 자동 증가 - 더 이상 사용하지 않음 (랜덤 문자열로 변경) */
    // String getLastReservationId();
    
    /* 예약 정보 조회 */
    @Select("SELECT " +
            "reservation_id, provider_code, provider_user_id, reservation_site, reservation_date, end_date, " +
            "reservation_status, total_price, checkin_time, checkout_time, qr_code, cancel_reason, refund_status, " +
            "requested_at, refunded_at, created_at, updated_at, campground_id, campground_name, full_address, sido, sigungu, " +
            "campground_type, zone_id, zone_name, zone_type, zone_terrain_type, capacity, check_in_date, check_out_date, " +
            "total_people, adults, children, infants, has_electricity, has_water " +
            "FROM reservations WHERE reservation_id = #{reservationId}")
    ReservationDTO findById(String reservationId);
}
