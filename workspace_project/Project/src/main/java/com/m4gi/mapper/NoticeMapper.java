package com.m4gi.mapper;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.ReservationAlertDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface NoticeMapper {

    /* ───────── 예약 알림 관련 ───────── */
    boolean existsByReservationAndTitle(@Param("reservationId") String reservationId,
                                        @Param("noticeTitle") String noticeTitle);

    List<ReservationAlertDTO> selectReservationAlerts(@Param("providerCode") int providerCode,
                                                      @Param("providerUserId") String providerUserId);

    /* ───────── 날짜별 조회 ───────── */
    List<NoticeDTO> selectTodayNotices();
    List<NoticeDTO> selectWeeklyNotices();

    /* ───────── 사용자별 조회 ───────── */
    List<NoticeDTO> selectNoticesByUser(@Param("providerCode") int providerCode,
                                        @Param("providerUserId") String providerUserId);

    /* ───────── 기본 CRUD ───────── */
    int insertNotice(NoticeDTO notice);
    int updateNotice(NoticeDTO notice);
    int deleteNotice(int noticeId);

    NoticeDTO findById(int noticeId);
    List<NoticeDTO> findAll();

    /* ───────── 검색 + 페이징 ───────── */
    List<NoticeDTO> searchNotices(@Param("keyword") String keyword,
                                  @Param("startDate") String startDate,
                                  @Param("endDate") String endDate,
                                  @Param("limit") int limit,
                                  @Param("offset") int offset);

    int countNotices(@Param("keyword") String keyword,
                     @Param("startDate") String startDate,
                     @Param("endDate") String endDate);
}
