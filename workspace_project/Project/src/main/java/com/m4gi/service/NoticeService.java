package com.m4gi.service;

import java.util.List;


import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;

public interface NoticeService {
	
  // [추가] 알림 생성을 위한 메서드 선언
  void createNotice(NoticeDTO notice); 

  //오늘 온 알림
  List<NoticeDTO> getTodayNotices();
  
  //이번주 알림
  List<NoticeDTO> getWeeklyNotices();
  
  List<NoticeDTO> getNoticesByUser(int providerCode, String providerUserId);
  
  List<ReservationAlertDTO> getReservationAlerts(int providerCode, String providerUserId);
}
