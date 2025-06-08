package com.m4gi.dto;

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
}
