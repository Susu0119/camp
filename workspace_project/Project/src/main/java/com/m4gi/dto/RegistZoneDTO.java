package com.m4gi.dto;

import java.time.LocalDate;
import java.util.List;

import lombok.Data;

@Data
public class RegistZoneDTO {
	private Integer zoneId;
	private Integer campgroundId;
	private String zoneName;
    private String description;
    private String zoneImagesStr;
    private int capacity;
    private String zoneType;
    private String zoneTerrainType;
    private int defaultWeekdayPrice;
    private int defaultWeekendPrice;
    
    private LocalDate peakStartDate;
    private LocalDate peakEndDate;
    private Integer peakWeekdayPrice; // Integer로 변경하여 null 허용
    private Integer peakWeekendPrice; // Integer로 변경하여 null 허용
}
