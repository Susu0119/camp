package com.m4gi.dto;

import java.time.LocalDate;

import lombok.Data;

@Data
public class RegistPeakSeasonDTO {
    private int campgroundId;
    private int zoneId;
    private LocalDate peakStartDate;     // yyyy-MM-dd
    private LocalDate peakEndDate;       // yyyy-MM-dd
    private int peakWeekdayPrice;
    private int peakWeekendPrice;
}
