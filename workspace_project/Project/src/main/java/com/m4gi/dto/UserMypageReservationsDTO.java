package com.m4gi.dto;

// 사용자 예약 목록 조회 dto
import java.util.Date;

import com.fasterxml.jackson.annotation.JsonProperty;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;


@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMypageReservationsDTO {
	private String reservationId; //예약 ID
	private String campgroundName; //캠핑장 이름
	private String addrFull; //캠핑장 주소 
	private Date reservationDate; //예정일
	private Date endDate; //종료일 
	private int totalPrice; //예약 총 금액
	private int reservationStatus; //1:예약완료, 2:취소됨
	private int checkinStatus;
	
	
	private String campgroundImage; //JSON 문자열 형태로 받음 
	 private CampgroundImage campgroundImageMap;

	 @Data
	 public static class CampgroundImage {
	     private List<String> map;
	     private List<String> detail;
	     private List<String> thumbnail;  
	 }

	    
	@JsonProperty("checkinStatus") //JSON에서 camelCase 사용하게 함
	private int checkinstatus;
	
}
