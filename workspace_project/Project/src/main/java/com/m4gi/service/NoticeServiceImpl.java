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
	
    @Override
    public List<NoticeDTO> getTodayNotices() {
        return noticeMapper.selectTodayNotices();
    }

    @Override
    public List<NoticeDTO> getWeeklyNotices() {
        return noticeMapper.selectWeeklyNotices();
    }

    @Override
    public void addNotice(NoticeDTO notice) {
        noticeMapper.insertNotice(notice);
    }
    
}
