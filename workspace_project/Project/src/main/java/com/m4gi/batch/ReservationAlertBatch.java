package com.m4gi.batch;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.mapper.NoticeMapper;
import com.m4gi.mapper.UserMypageReservationsMapper;

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class ReservationAlertBatch {
	
	private final UserMypageReservationsMapper reservationsMapper;
	private final NoticeMapper noticeMapper;
	
    @Scheduled(cron = "0 0 1 * * ?") // 매일 새벽 1시에 실행
    public void generateReservationNotices() {
        LocalDate today = LocalDate.now();
        List<LocalDate> targetDates = List.of(today.plusDays(5), today.plusDays(1), today);

        for (LocalDate targetDate : targetDates) {
        	
        	List<UserMypageReservationsDTO> reservations = reservationsMapper.findUserReservationsByDate(targetDate);
            
            for (UserMypageReservationsDTO r : reservations) {
                // 예약완료 상태만 필터링
                if (r.getReservationStatus() != 1) continue;

                String title;
                String content = String.format(
                        "- 예약번호: %s\n- 입실일시: %s\n- 캠핑장: %s\n- 주소: %s\n- 상태: 예약완료",
                        r.getReservationId(),
                        r.getReservationDate(),  // 오타: reserva**i**onDate → reservationDate (DTO 수정 권장)
                        r.getCampgroundName(),
                        r.getAddrFull()
                );

                if (targetDate.equals(today.plusDays(5))) {
                    title = "🛎️ 곧 캠핑 일정이 시작돼요!";
                } else if (targetDate.equals(today.plusDays(1))) {
                    title = "⛺ 입실 하루 전입니다. 짐 챙기셨나요?";
                } else {
                    title = "🎉 오늘 캠핑 일정이 시작돼요!";
                }

                NoticeDTO notice = NoticeDTO.builder()
                        .noticeTitle(title)
                        .noticeContent(content)
                        .isPublished(true)
                        .build();

                noticeMapper.insertNotice(notice);
            }
        }
    }
}
