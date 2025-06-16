package com.m4gi.mapper;

import com.m4gi.dto.NoticeDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AnnouncementMapper {

    /* ───────── 날짜별 조회 ───────── */
    List<NoticeDTO> selectTodayAnnouncements();
    List<NoticeDTO> selectWeeklyAnnouncements();

    /* ───────── 사용자별 조회 ───────── */
    List<NoticeDTO> selectAnnouncementsByUser(@Param("providerCode") int providerCode,
                                              @Param("providerUserId") String providerUserId);

    /* ───────── 기본 CRUD ───────── */
    int insertAnnouncement(NoticeDTO notice);
    int updateAnnouncement(NoticeDTO notice);
    int deleteAnnouncement(int noticeId);

    NoticeDTO findAnnouncementById(int noticeId);
    List<NoticeDTO> findAllAnnouncements();

    /* ───────── 검색 + 페이징 ───────── */
    List<NoticeDTO> searchAnnouncements(@Param("keyword") String keyword,
                                        @Param("startDate") String startDate,
                                        @Param("endDate") String endDate,
                                        @Param("limit") int limit,
                                        @Param("offset") int offset);

    int countAnnouncements(@Param("keyword") String keyword,
                           @Param("startDate") String startDate,
                           @Param("endDate") String endDate);
}
