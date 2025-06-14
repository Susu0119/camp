package com.m4gi.dto;

import lombok.Data;

@Data
public class ZoneInfoDTO {
    private Integer zoneId;
    private String zoneName;
    private Integer capacity;
    private boolean isActive;
}