package com.m4gi.service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.mapper.NoticeMapper;
import com.m4gi.mapper.UserMypageReservationsMapper;

@Service
public class NoticeServiceImpl implements NoticeService {
	
	@Autowired
    private NoticeMapper noticeMapper;

	@Autowired
    private UserMypageReservationsMapper userMypageReservationsMapper; 
	
	@Autowired
    public NoticeServiceImpl(NoticeMapper noticeMapper) {
        this.noticeMapper = noticeMapper;
    }

	
    @Override
    public List<NoticeDTO> getTodayNotices() {
        return noticeMapper.selectTodayNotices();
    }

    @Override
    public List<NoticeDTO> getWeeklyNotices() {
        return noticeMapper.selectWeeklyNotices();
    }
	
    @Override
    public List<ReservationAlertDTO> getReservationAlerts(int providerCode, String providerUserId) {
        List<ReservationAlertDTO> reservations = userMypageReservationsMapper.selectReservationAlerts(providerCode, providerUserId);

        LocalDate today = LocalDate.now();

        for (ReservationAlertDTO r : reservations) {
            LocalDate reservationDate = r.getReservationDate();
            if (reservationDate == null) {
                r.setAlertMessage(null);
                continue;
            }

            long daysLeft = ChronoUnit.DAYS.between(today, reservationDate);
            r.setDaysLeft((int)daysLeft);  // 필요하면 daysLeft도 세팅

            String alertMessage = null;
            if (daysLeft == 3) {
                alertMessage = "캠핑 3일 전입니다! 준비 잘 하세요!";
            } else if (daysLeft == 1) {
                alertMessage = "캠핑 하루 전입니다! 짐 챙기셨나요?";
            } else if (daysLeft == 0) {
                alertMessage = "오늘 캠핑 시작합니다! 즐거운 시간 보내세요!";
            }

            r.setAlertMessage(alertMessage);
        }

        return reservations;
    }

    @Override
    public List<NoticeDTO> getNoticesByUser(int providerCode, String providerUserId) {
        return noticeMapper.selectNoticesByUser(providerCode, providerUserId);
    }


}
