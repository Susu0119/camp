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
	
	@Scheduled(cron = "0 0 1 * * ?") // 매일 새벽 1시
	public void generateReservationNotices() {
	    LocalDate today = LocalDate.now();
	    List<LocalDate> targetDates = List.of(today.plusDays(3), today.plusDays(1), today);

	    for (LocalDate targetDate : targetDates) {
	        List<UserMypageReservationsDTO> reservations = reservationsMapper.findUserReservationsByDate(targetDate);

	        for (UserMypageReservationsDTO r : reservations) {
	            if (r.getReservationStatus() != 1) continue;  // 예약완료만

	            String title;
	            if (targetDate.equals(today.plusDays(3))) {
	                title = "⏳ 캠핑 3일 전입니다! 준비 잘 하세요!";
	            } else if (targetDate.equals(today.plusDays(1))) {
	                title = "⛺ 캠핑 하루 전입니다! 짐 챙기셨나요?";
	            } else {
	                title = "🎉 오늘 캠핑 시작합니다! 즐거운 시간 보내세요!";
	            }

	            String content = String.format(
	                "- 예약번호: %s\n- 입실일시: %s\n- 캠핑장: %s\n- 주소: %s\n- 상태: 예약완료",
	                r.getReservationId(),
	                r.getReservationDate(),
	                r.getCampgroundName(),
	                r.getAddrFull()
	            );

	            // 중복 알림 체크(예시, noticeMapper에 구현 필요)
	            boolean alreadyNotified = noticeMapper.existsByReservationAndTitle(r.getReservationId(), title);
	            if (alreadyNotified) {
	                continue;
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
