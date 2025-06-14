package com.m4gi.dto;

import java.time.LocalDateTime; 
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ReservationAlertDTO {
	
    // 내부적으로 알림이 어떤 예약에 대한 것인지 식별하기 위한 예약 ID (화면에 직접 표시하지 않음)
    private String reservationId;
    // 알림과 관련된 캠핑장 이름 (화면에 표시)
    private String campgroundName;
    // 동적으로 생성된 알림 메시지 (예: "캠핑 D-3 알림", "예약 완료되었습니다!")
    private String alertMessage;
    // 알림이 생성된 기준 시점 또는 알림 관련 이벤트의 시간 (화면에 표시 및 정렬 기준)
    private LocalDateTime alertTimestamp;
    // 알림의 유형을 구분하기 위한 문자열 (예: "RESERVATION_COMPLETED", "REMINDER_PRE_CAMP")
    private String alertType;
}