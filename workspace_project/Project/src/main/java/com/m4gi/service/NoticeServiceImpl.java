package com.m4gi.service;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.mapper.NoticeMapper;
import com.m4gi.mapper.UserMypageReservationsMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class NoticeServiceImpl implements NoticeService {

    @Autowired
    private NoticeMapper noticeMapper;

    @Autowired
    private UserMypageReservationsMapper userMypageReservationsMapper;

    /* ───────── 오늘/이번주 ───────── */
    @Override
    public List<NoticeDTO> getTodayNotices()  { return noticeMapper.selectTodayNotices(); }

    @Override
    public List<NoticeDTO> getWeeklyNotices() { return noticeMapper.selectWeeklyNotices(); }

    /* ───────── 사용자별 ───────── */
    @Override
    public List<NoticeDTO> getNoticesByUser(int providerCode, String providerUserId) {
        return noticeMapper.selectNoticesByUser(providerCode, providerUserId);
    }

    /* ───────── 예약 알림 ───────── */
    @Override
    public List<ReservationAlertDTO> getReservationAlerts(int providerCode, String providerUserId) {
        List<ReservationAlertDTO> list =
                userMypageReservationsMapper.selectReservationAlerts(providerCode, providerUserId);

        LocalDate today = LocalDate.now();
        for (ReservationAlertDTO r : list) {
            if (r.getReservationDate() == null) continue;
            long d = ChronoUnit.DAYS.between(today, r.getReservationDate());
            r.setDaysLeft((int) d);

            if (d == 3)      r.setAlertMessage("캠핑 3일 전입니다! 준비 잘 하세요!");
            else if (d == 1) r.setAlertMessage("캠핑 하루 전입니다! 짐 챙기셨나요?");
            else if (d == 0) r.setAlertMessage("오늘 캠핑 시작합니다! 즐거운 시간 보내세요!");
        }
        return list;
    }

    /* ───────── CRUD ───────── */
    @Override public void addNotice(NoticeDTO notice)           { noticeMapper.insertNotice(notice); }

    @Override public void updateNotice(NoticeDTO notice)        { noticeMapper.updateNotice(notice); }

    @Override public void deleteNotice(int noticeId)            { noticeMapper.deleteNotice(noticeId); }

    @Override public List<NoticeDTO> getAllNotices()            { return noticeMapper.findAll(); }

    @Override public NoticeDTO getNoticeDetail(int noticeId)    { return noticeMapper.findById(noticeId); }

    /* ───────── 검색 / 페이징 ───────── */
    @Override
    public List<NoticeDTO> searchNotices(String keyword, String startDate,
                                         String endDate, int page, int size) {
        int offset = (page - 1) * size;
        return noticeMapper.searchNotices(keyword, startDate, endDate, size, offset);
    }

    @Override
    public int countNotices(String keyword, String startDate, String endDate) {
        return noticeMapper.countNotices(keyword, startDate, endDate);
    }
}
