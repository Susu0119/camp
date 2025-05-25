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
    private Integer reservationStatus;  // 1:예약 완료,2:취소,3:입실전,4:입실완료,5:퇴실 완료
};
