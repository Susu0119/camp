package com.m4gi.dto;

import java.time.LocalTime;
import java.util.List;

import lombok.Data;

@Data
public class RegistCampgroundDTO {
	private Integer campgroundId;
    private String campgroundName;
    private String campgroundPhone;
    private List<String> campgroundType;
    private String campgroundTypeStr; // List → String 변환 후 저장
    private String addrFull;
    private String addrSido;
    private String addrSigungu;
    private String description;
    private String campgroundImageStr; // JSON 문자열
    private String campgroundVideo;
    private List<String> environments;
    private String environmentsStr; // List → String 변환 후 저장
    private float totalAreaSqm;
    private LocalTime checkinTime;
    private LocalTime checkoutTime;
    private String mapService;
}
