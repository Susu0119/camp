package com.m4gi.dto.admin;

import java.time.LocalDate;
import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class AdminReservationListDTO {

    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private int checkinStatus; // 입실상태 -> 입실전 / 입실완료 / 퇴실완료

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss") // 날짜/시간 포맷 명시, 프론트 연동 시 필요함!
    private LocalDateTime checkinTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkoutTime;
    private int reservationStatus;
    private Integer refundStatus; // nullable

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;


}
