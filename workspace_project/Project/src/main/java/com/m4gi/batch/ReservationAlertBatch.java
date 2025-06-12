package com.m4gi.batch;

import java.time.LocalDate;
import java.util.List;

import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import com.m4gi.dto.NoticeDTO;
import com.m4gi.dto.UserMypageReservationsDTO; // UserMypageReservationsDTO 임포트
import com.m4gi.mapper.NoticeMapper;
import com.m4gi.mapper.UserMypageReservationsMapper; // UserMypageReservationsMapper 임포트

import lombok.RequiredArgsConstructor;


@Component
@RequiredArgsConstructor
public class ReservationAlertBatch {
	
	private final UserMypageReservationsMapper reservationsMapper;
	private final NoticeMapper noticeMapper;
	
	@Scheduled(cron = "0 0 1 * * ?") // 매일 새벽 1시
	public void generateReservationNotices() {
	    LocalDate today = LocalDate.now();
	    // 오늘 날짜, 내일(1일 전), 3일 전 예약을 대상으로 알림을 생성합니다.
	    // 주의: 오늘이 6월 11일이면 today.plusDays(1)은 6월 12일, today.plusDays(3)은 6월 14일입니다.
	    // 만약 "캠핑 3일 전"이 오늘로부터 3일 뒤를 의미한다면 List.of(today.plusDays(3), today.plusDays(1), today)가 맞습니다.
	    // (예: 6/11 실행 -> 6/14, 6/12, 6/11의 예약에 대해 알림 생성)
	    List<LocalDate> targetDates = List.of(today.plusDays(3), today.plusDays(1), today);

	    System.out.println("[ReservationAlertBatch] 알림 생성 배치 시작. 대상 날짜: " + targetDates);

	    for (LocalDate targetDate : targetDates) {
	        // 해당 날짜에 예약이 있는 사용자의 예약 목록을 조회합니다.
	        // UserMypageReservationsMapper에 findUserReservationsByDate 메서드가 정의되어 있고
	        // 해당 날짜를 포함하는 예약 (reservationDate 또는 endDate 기준)을 가져온다고 가정합니다.
	        List<UserMypageReservationsDTO> reservations = reservationsMapper.findUserReservationsByDate(targetDate);
	        System.out.println("[Batch] " + targetDate + " 날짜에 해당하는 예약 " + reservations.size() + "건 조회됨.");

	        for (UserMypageReservationsDTO r : reservations) {
	            // 예약 상태가 '예약 완료' (status 1)인 경우에만 알림 생성
	            if (r.getReservationStatus() != 1) {
	                System.out.println("[Batch] 예약 상태가 완료가 아니므로 스킵: 예약번호 " + r.getReservationId() + ", 상태 " + r.getReservationStatus());
	                continue;
	            }

	            String title;
	            if (targetDate.equals(today.plusDays(3))) {
	                title = "⏳ 캠핑 3일 전입니다! 준비 잘 하세요!";
	            } else if (targetDate.equals(today.plusDays(1))) {
	                title = "⛺ 캠핑 하루 전입니다! 짐 챙기셨나요?";
	            } else { // targetDate.equals(today)
	                title = "🎉 오늘 캠핑 시작합니다! 즐거운 시간 보내세요!";
	            }

	            String content = String.format(
	                "- 입실일시: %s\n- 캠핑장: %s\n- 주소: %s\n- 상태: 예약완료",
	                r.getReservationDate(), // LocalDate 타입이므로 toString()으로 자동 변환됩니다.
	                r.getCampgroundName(),
	                r.getAddrFull()
	            );

	            // 중복 알림 체크 (noticeMapper에 existsByReservationAndTitle 메서드 구현 필요)
	            // 이 메서드는 특정 예약 ID와 알림 제목으로 이미 알림이 생성되었는지 확인합니다.
	            try {
	                boolean alreadyNotified = noticeMapper.existsByReservationAndTitle(r.getReservationId(), title);
	                if (alreadyNotified) {
	                    System.out.println("[Batch] 중복 알림이 감지되어 스킵합니다: 예약번호 " + r.getReservationId() + ", 제목 '" + title + "'");
	                    continue;
	                }
	            } catch (Exception e) {
	                System.err.println("[Batch 오류] 중복 알림 체크 중 오류 발생: " + e.getMessage());
	                e.printStackTrace();
	                // 오류 발생 시 중복 체크 건너뛰고 알림 생성 시도 (데이터 중복 가능성 있음)
	                // 또는 여기서 continue; 하여 해당 알림 생성을 스킵할 수 있습니다.
	            }

	            // NoticeDTO.builder() 사용 시 필드명에 맞게 호출해야 합니다.
	            NoticeDTO notice = NoticeDTO.builder()
	                    .noticeTitle(title) // <<--- 여기 수정 (noticeTitle -> notice_title)
	                    .noticeContent(content) // <<--- 여기 수정 (noticeContent -> notice_content)
	                    .isPublished(true) // is_published 필드명 사용
	                    .providerCode(r.getProviderCode()) // <<--- 추가: 사용자 정보
	                    .providerUserId(r.getProviderUserId()) // <<--- 추가: 사용자 정보
	                    .build();

	            try {
	                noticeMapper.insertNotice(notice);
	                System.out.println("[Batch] 알림 생성 성공: 예약번호 " + r.getReservationId() + ", 제목 '" + title + "'");
	            } catch (Exception e) {
	                System.err.println("[Batch 오류] 알림 삽입 중 오류 발생 (예약번호: " + r.getReservationId() + ", 제목: '" + title + "'): " + e.getMessage());
	                e.printStackTrace();
	            }
	        }
	    }
	    System.out.println("[ReservationAlertBatch] 알림 생성 배치 종료.");
	}
}