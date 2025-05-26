package com.m4gi.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.databind.PropertyNamingStrategies;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminReservationListDTO {

    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private String checkinStatus; // 입실상태 -> 입실전 / 입실완료 / 퇴실완료

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss") // 날짜/시간 포맷 명시, 프론트 연동 시 필요함!
    private LocalDateTime checkinTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkoutTime;
    private int reservationStatus;
    private Integer refundStatus; // nullable

    public void calculateCheckinStatus() {
        LocalDateTime now = LocalDateTime.now();
        if (checkinTime != null && checkoutTime != null) {
            if (now.isBefore(checkinTime)) {
                checkinStatus = "입실전";
            } else if (now.isBefore(checkoutTime)) {
                checkinStatus = "입실완료";
            } else {
                checkinStatus = "퇴실완료";
            }
        } else {
            checkinStatus = "-";
        }
    }

}
