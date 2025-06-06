package com.m4gi.dto;

import java.util.Date;

import lombok.Data;
import lombok.ToString;

//사용자 이용 취소/환불 목록 dto
@Data
@ToString
public class CanceledReservationsDTO {
		private String campgroundName; // 캠핑장 이름
		private String siteName;       // 사이트 이름 추가
		private Date reservationDate;  // 방문 예정일
		private Date refundedAt;       // 취소한 날짜

}
