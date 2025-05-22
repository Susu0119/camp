package com.m4gi.dto;

import java.sql.Date;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMypageReservationsDTO {
	private String reservationId; //예약 ID
	private String campgroundName; //캠핑장 이름
	private String addrFull; //캠핑장 주소 
	private Date reservaionDate; //예정일
	private Date endDate; //종료일 
	private int totalPrice; //예약 총 금액
	private int reservationStatus; //1:예약완료, 2:취소됨
}
