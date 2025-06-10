package com.m4gi.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminReservationDTO {

    private String reservationId;
    private String userNickname;

    private String campgroundName;

    private int checkinStatus;       // 입실상태 (1: 입실전, 2: 입실완료, 3: 퇴실완료)
    private Integer refundType;      // 환불 구분 (0: 자동, 1: 수동)
    private int reservationStatus;   // 예약 상태 (1: 완료, 2: 취소)
    private Integer refundStatus;    // 환불 상태 (nullable)

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkinTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkoutTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd")
    private LocalDate reservationDate;
}
