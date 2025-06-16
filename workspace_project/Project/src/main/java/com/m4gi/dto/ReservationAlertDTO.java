package com.m4gi.dto;

import java.sql.Date;
import java.time.LocalDate;
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
//    private String reservationId;
//    private LocalDate reservationDate;
//    private LocalDateTime createdAt;
//    private String reservationSite;
//    private String alertMessage;
//    private LocalDate endDate;
//    private int daysLeft;
//    private String name;
//    private String campgroundName;
//    private Date startDate;
    
    private String alertId; // 동적 생성 알림이므로 고유 ID는 예약 ID로 대체하거나 UUID 생성 (여기서는 reservationId 사용)
    private String alertTitle;
    private String alertContent;
    private LocalDateTime createdAt;
    private Integer providerCode;
    private String providerUserId;
    private String reservationId; // 이 알림이 어떤 예약에 대한 것인지 식별
    private String campgroundName; // 알림 내용에 포함될 캠핑장 이름
}
