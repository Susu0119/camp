package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;

@Mapper
public interface NoticeMapper {
	
	//예약 id와 제목으로 이미 알림이 존재하는지 체크
	 boolean existsByReservationAndTitle(@Param("reservationId") String reservationId, @Param("noticeTitle") String noticeTitle);

	//오늘 알림 
    List<NoticeDTO> selectTodayNotices();

    //7일간의 알림 내역
    List<NoticeDTO> selectWeeklyNotices();
    
    //사용자 예약 알림
    List<ReservationAlertDTO> selectReservationAlerts(@Param("providerCode") int providerCode,
            @Param("providerUserId") String providerUserId);
//
//    List<NoticeDTO> selectNoticesByUser(@Param("providerCode") int providerCode,
//            @Param("providerUserId") String providerUserId);

    
    // 사용자별 알림 목록 조회
    List<NoticeDTO> selectNoticesByUser(@Param("providerCode") int providerCode, @Param("providerUserId") String providerUserId);

    // 알림 삽입
    int insertNotice(NoticeDTO notice); // NoticeDTO 객체를 받아 삽입
    
}	
