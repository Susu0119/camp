package com.m4gi.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CanceledReservationsDTO; // 이 DTO가 사용되지 않는다면 삭제해도 됩니다.
import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.dto.UserMypageReservationsDTO;

@Mapper
public interface UserMypageReservationsMapper {

    // 예약 중인 목록 조회 (로그인 사용자 기준)
    List<UserMypageReservationsDTO> selectOngoingReservations(
                @Param("providerCode") int providerCode,
                @Param("providerUserId") String providerUserId);

    // 이용 완료된 예약 목록 조회
    List<UserMypageReservationsDTO> getCompletedReservations(
                @Param("providerCode") int providerCode,
                @Param("providerUserId") String providerUserId);

    // 예약 취소/환불 내역 조회
    List<UserMypageReservationsDTO> getCanceledReservations(
                @Param("providerCode") int providerCode,
                @Param("providerUserId") String providerUserId);

    // 예약 취소 처리 
    int updateReservationCancel(
                @Param("reservationId") String reservationId,
                @Param("cancelReason") String cancelReason,
                @Param("customReason") String customReason,
                @Param("refundStatus") Integer refundStatus,
                @Param("requestedAt") java.sql.Timestamp requestedAt,
                @Param("providerCode") int providerCode,       
                @Param("providerUserId") String providerUserId
    );

    // 예약 id로 단일 예약 조회 (체크리스트 생성 전용)
    UserMypageReservationsDTO selectReservationById(@Param("reservationId") String reservationId);

    // 알림용 예약 조회
    List<ReservationAlertDTO> selectReservationAlerts(
                @Param("providerCode") int providerCode,
                @Param("providerUserId") String providerUserId);

    // 날짜 기반 예약 조회
    List<UserMypageReservationsDTO> findUserReservationsByDate(@Param("targetDate") LocalDate targetDate);
}