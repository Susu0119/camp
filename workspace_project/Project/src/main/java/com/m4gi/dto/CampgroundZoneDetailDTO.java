package com.m4gi.dto;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Data;

@Data
public class CampgroundZoneDetailDTO {
    private int zoneId;
    private int campgroundId;
    private String zoneName;
    private String zoneType;
    private String zoneTerrainType;
    private int capacity;
    private String description;
    private String zoneImage; // JSON 전체 문자열 저장됨
    private Integer defaultWeekdayPrice;
    private Integer defaultWeekendPrice;
    private Integer peakWeekdayPrice; // 성수기 평일 가격
    private Integer peakWeekendPrice; // 성수기 주말 가격

    @JsonProperty("isPeakSeason")
    private boolean isPeakSeason; // 성수기 여부

    private List<CampgroundSiteDTO> sites;

    private List<ReviewDTO> reviews;
}
