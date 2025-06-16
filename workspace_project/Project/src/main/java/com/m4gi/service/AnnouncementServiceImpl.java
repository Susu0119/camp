package com.m4gi.service;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.mapper.AnnouncementMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AnnouncementServiceImpl implements AnnouncementService {

    @Autowired
    private AnnouncementMapper announcementMapper;

    /* ───────── 날짜별 조회 ───────── */
    @Override
    public List<NoticeDTO> getTodayAnnouncements() {
        return announcementMapper.selectTodayAnnouncements();
    }

    @Override
    public List<NoticeDTO> getWeeklyAnnouncements() {
        return announcementMapper.selectWeeklyAnnouncements();
    }

    /* ───────── 사용자별 조회 ───────── */
    @Override
    public List<NoticeDTO> getAnnouncementsByUser(int providerCode, String providerUserId) {
        return announcementMapper.selectAnnouncementsByUser(providerCode, providerUserId);
    }

    /* ───────── CRUD ───────── */
    @Override
    public void addAnnouncement(NoticeDTO notice) {
        announcementMapper.insertAnnouncement(notice);
    }

    @Override
    public void updateAnnouncement(NoticeDTO notice) {
        announcementMapper.updateAnnouncement(notice);
    }

    @Override
    public void deleteAnnouncement(int noticeId) {
        announcementMapper.deleteAnnouncement(noticeId);
    }

    @Override
    public List<NoticeDTO> getAllAnnouncements() {
        return announcementMapper.findAllAnnouncements();
    }

    @Override
    public NoticeDTO getAnnouncementDetail(int noticeId) {
        return announcementMapper.findAnnouncementById(noticeId);
    }

    /* ───────── 검색 및 페이징 ───────── */
    @Override
    public List<NoticeDTO> searchAnnouncements(String keyword, String startDate,
                                               String endDate, int page, int size) {
        int offset = (page - 1) * size;
        return announcementMapper.searchAnnouncements(keyword, startDate, endDate, size, offset);
    }

    @Override
    public int countAnnouncements(String keyword, String startDate, String endDate) {
        return announcementMapper.countAnnouncements(keyword, startDate, endDate);
    }
}
