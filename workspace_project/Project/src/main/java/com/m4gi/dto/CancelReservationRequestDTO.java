package com.m4gi.dto;

import java.util.Date;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;


//사용자의 예약 취소 dto
@Data
public class CancelReservationRequestDTO {
	 private String reservationId;      // 예약 ID
	    private String cancelReason;       // 취소 사유
	    private Integer refundStatus;  // 1: 환불 요청, 2: 환불 완료

	    // 날짜 포맷 지정
	    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	    private Date requestedAt; //환불 요청 일시
}
