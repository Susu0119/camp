package com.m4gi.dto.admin;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.m4gi.enums.ReservationStatus;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
public class AdminReservationDetailDTO {

    private String reservationId;
    private String userNickname;
    private String campgroundName;
    private String reservationSite;
    private LocalDate reservationDate;
    private int checkinStatus;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkinTime;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd'T'HH:mm:ss")
    private LocalDateTime checkoutTime;
    private int reservationStatus;
    private Integer refundStatus;

    private String cancelReason = "-";       // 취소 사유 없을 경우 기본값
    private String refundStatusText = "없음"; // 환불 상태 텍스트용 (뷰 출력)

    private LocalDateTime requestedAt;
    private LocalDateTime refundedAt;


    public String getRefundStatusLabel() {
        return refundStatus != null ? ReservationStatus.fromCode(refundStatus).getLabel() : "없음";
    }

    public String getCheckinStatus() {
        LocalDateTime now = LocalDateTime.now();
        if (now.isBefore(checkinTime)) return "입실전";
        else if (now.isAfter(checkoutTime)) return "퇴실완료";
        else return "입실완료";
    }

}

