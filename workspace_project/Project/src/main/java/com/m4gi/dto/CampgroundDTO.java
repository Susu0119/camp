package com.m4gi.dto;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Set;

import lombok.Data;

@Data
public class CampgroundDTO {
	private String campgroundId;
    private String campgroundName;
    private String campgroundPhone;
    private Set<String> campgroundType;
    private String addrFull;
    private String addrSido;
    private String addrSigungu;
    private String description;
    private List<String> campgroundImage;
    private String campgroundVideo;
    private Map<String, String> environments;
    private Float totalAreaSqm;
    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;
    private Double latitude;
    private Double longitude;
    private String mapService;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
