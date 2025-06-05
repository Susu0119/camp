package com.m4gi.dto;

import lombok.Data;

@Data
public class CampgroundSiteDTO {
	private String siteId;
    private String siteName;
    private float widthMeters;
    private float heightMeters;
    private int capacity;
    private int isActive;
    private String zoneId;
}
