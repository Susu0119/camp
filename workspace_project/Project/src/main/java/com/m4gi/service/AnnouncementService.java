package com.m4gi.service;

import com.m4gi.dto.NoticeDTO;

import java.util.List;

public interface AnnouncementService {

    // 오늘 등록된 공지사항
    List<NoticeDTO> getTodayAnnouncements();

    // 이번 주 등록된 공지사항
    List<NoticeDTO> getWeeklyAnnouncements();

    // 특정 작성자의 공지사항
    List<NoticeDTO> getAnnouncementsByUser(int providerCode, String providerUserId);

    // 공지사항 등록 / 수정 / 삭제
    void addAnnouncement(NoticeDTO notice);
    void updateAnnouncement(NoticeDTO notice);
    void deleteAnnouncement(int noticeId);

    // 전체 목록 / 상세
    List<NoticeDTO> getAllAnnouncements();
    NoticeDTO getAnnouncementDetail(int noticeId);

    // 검색 및 페이징
    List<NoticeDTO> searchAnnouncements(String keyword, String startDate, String endDate,
                                        int page, int size);
    int countAnnouncements(String keyword, String startDate, String endDate);
}
