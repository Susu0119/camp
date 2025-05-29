package com.m4gi.service;

import java.util.List;


import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;

public interface NoticeService {

  //오늘 온 알림
  List<NoticeDTO> getTodayNotices();
  
  //이번주 알림
  List<NoticeDTO> getWeeklyNotices();
  
  List<NoticeDTO> getNoticesByUser(String userId);
  
  List<ReservationAlertDTO> getReservationAlerts(int providerCode, String providerUserId);
}
