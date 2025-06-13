package com.m4gi.dto;

import java.time.LocalDate;
import lombok.Data;

@Data
public class ReservationSummaryDTO {
    private String     reservationId;   // 예약 PK
    private String     campgroundName;  // 캠핑장 이름
    private String     siteName;        // 사이트 이름
    private LocalDate  checkIn;         // 체크-인
    private LocalDate  checkOut;        // 체크-아웃
}