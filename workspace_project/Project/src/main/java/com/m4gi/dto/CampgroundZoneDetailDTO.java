package com.m4gi.dto;

import java.util.List;

import lombok.Data;

@Data
public class CampgroundZoneDetailDTO {
	private String zoneId;
	private String zoneName;
    private String zoneType;
    private String zoneTerrainType;
    private int capacity;
    private String description;
    
    private List<CampgroundSiteDTO> sites;

    private List<ReviewDTO> reviews;
}
