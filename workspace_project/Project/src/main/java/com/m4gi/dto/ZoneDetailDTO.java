package com.m4gi.dto;

import java.time.LocalDate;

import lombok.Data;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class ZoneDetailDTO {
	// campground_zones 테이블
	private Integer zoneId;
	private Integer campgroundId;
	private String zoneName;
	private String description;
	private String zoneImagesStr;
	private Integer capacity;
	private String zoneType;
	private String zoneTerrainType;
	private Integer defaultWeekdayPrice;
	private Integer defaultWeekendPrice;
	
	// 성수기 테이블 
	private Integer priceId;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate peakStartDate;
	@JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
	private LocalDate peakEndDate;
	private Integer peakWeekdayPrice;
	private Integer peakWeekendPrice;
}
