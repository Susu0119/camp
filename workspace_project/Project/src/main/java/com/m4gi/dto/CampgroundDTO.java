package com.m4gi.dto;

import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Data
public class CampgroundDTO {
    private int campgroundId;
    private String campgroundName;
    private String phone;
    private String address;
    private String checkinTime;
    private String checkoutTime;

    private List<LocalDate> unavailableDates;

}