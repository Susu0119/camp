package com.m4gi.dto;

import lombok.Data;

@Data
public class StaffReservationDTO {
	private String reservationId;
    private String reserverName;
    private String siteName;
    private String checkInDate;
    private String checkOutDate;
    private String checkInTime;
    private String checkOutTime;
    private Integer reservationStatus;  // 1: 예약 완료, 2: 예약 취소
    private Integer checkinStatus; // 1: 입실전 2: 입실완료 3: 퇴실완료
};
