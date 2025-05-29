package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;

@Mapper
public interface NoticeMapper {
	
	 void insertNotice(NoticeDTO notice);

	//오늘 알림 
    List<NoticeDTO> selectTodayNotices();

    //7일간의 알림 내역
    List<NoticeDTO> selectWeeklyNotices();
    
    //사용자 예약 알림
    List<ReservationAlertDTO> selectReservationAlerts(
    	    @Param("providerCode") int providerCode,
    	    @Param("providerUserId") String providerUserId
    	);

    
}	
