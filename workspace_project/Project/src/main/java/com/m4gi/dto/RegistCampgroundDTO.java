package com.m4gi.dto;

import java.time.LocalTime;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

@Data
public class RegistCampgroundDTO {
	private Integer campgroundId;
    private String campgroundName;
    private String campgroundPhone;
    private String campgroundTypeStr;
    private String addrFull;
    private String addrSido;
    private String addrSigungu;
    private String description;
    private String campgroundImageStr; // JSON 문자열
    private String campgroundVideo;
    private String environmentsStr;
    private float totalAreaSqm;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime checkinTime;
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "HH:mm")
    private LocalTime checkoutTime;
    private String mapService;
}
