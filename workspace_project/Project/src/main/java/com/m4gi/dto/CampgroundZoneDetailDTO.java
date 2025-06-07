package com.m4gi.dto;

import java.util.List;

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

    private List<CampgroundSiteDTO> sites;

    private List<ReviewDTO> reviews;
}
