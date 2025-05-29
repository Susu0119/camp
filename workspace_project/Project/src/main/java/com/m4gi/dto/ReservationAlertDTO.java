package com.m4gi.dto;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class ReservationAlertDTO {
	private String reservationId;
    private LocalDate reservationDate;
    private LocalDateTime createdAt;
    private String reservationSite;
    private String alertMessage;
    private LocalDate endDate;
    private int daysLeft; 
}
