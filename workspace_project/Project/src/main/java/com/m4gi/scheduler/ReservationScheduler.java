package com.m4gi.scheduler;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;
import com.m4gi.service.StaffReservationService;

import lombok.RequiredArgsConstructor;

@Component
@RequiredArgsConstructor
public class ReservationScheduler {
	private static final Logger log = LoggerFactory.getLogger(ReservationScheduler.class);

    final private StaffReservationService reservationService;

    // 매 분 0초에 실행 (시연을 위해 짧게 설정)
    @Scheduled(cron = "0 * * * * *")
    public void autoCheckout() {
        log.info("자동 퇴실 처리 스케줄러 실행...");
        int updatedCount = reservationService.autoCheckoutReservations();
        if (updatedCount > 0) {
            log.info("{} 건의 예약이 자동으로 퇴실 처리되었습니다.", updatedCount);
        }
    }
}
