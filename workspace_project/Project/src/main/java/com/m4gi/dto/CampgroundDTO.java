package com.m4gi.dto;

import lombok.Data;

@Data
public class CampgroundDTO {
    private int campgroundId;
    private String campgroundName;
    private String phone;
    private String address;
    private String checkinTime;
    private String checkoutTime;

}