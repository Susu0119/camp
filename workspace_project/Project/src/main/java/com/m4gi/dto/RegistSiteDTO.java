package com.m4gi.dto;

import lombok.Data;

@Data
public class RegistSiteDTO {
	private int campgroundId;
	private int zoneId;
	private int siteId;
	private String siteName;
    private int capacity;
    private int currentStock;
    private float widthMeters;
    private float heightMeters;
}
