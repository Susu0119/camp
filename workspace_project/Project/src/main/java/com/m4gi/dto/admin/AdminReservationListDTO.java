package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Data
@NoArgsConstructor
public class AdminReservationListDTO {

    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private LocalDate checkinDate;
    private LocalDate checkoutDate;
    private String reservationStatus;
    private String paymentStatus;
}
