package com.m4gi.dto;

import java.util.Date;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;


import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;


//사용자의 예약 취소 dto
@Data
public class CancelReservationRequestDTO {
	 private String reservationId;      // 예약 ID
	    private String cancelReason;       // 취소 사유
	    private Integer refundStatus;  // 1: 환불 요청, 2: 환불 완료
	    private String campgroundImage; //JSON 문자열 형태로 받음 
	 
	    private String customReason;
	    
	    private List<String> images; // 파싱된 이미지 URL 리스트
	    
	    // 날짜 포맷 지정
	    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss", timezone = "Asia/Seoul")
	    private Date requestedAt; //환불 요청 일시
}
