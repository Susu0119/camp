package com.m4gi.dto.admin;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminReservationListDTO {

    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private LocalDateTime checkinTime;
    private LocalDateTime checkoutTime;
    private int reservationStatus;
    private Integer refundStatus; // nullable
}
