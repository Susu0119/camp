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
    private String reservationId;
    private LocalDate reservationDate;
    private LocalDateTime createdAt;
    private String reservationSite;
    private String alertMessage;
    private LocalDate endDate;
    private int daysLeft;
    private String name;
    private String campgroundName;
    private Date startDate;
}
