package com.m4gi.dto;

import java.util.Date;


import lombok.Data;
import lombok.ToString;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.util.Collections;
import java.util.List;
import java.util.Map;


//사용자 이용 취소/환불 목록 dto
@Data
@ToString
public class CanceledReservationsDTO {
	private String campgroundName;  // 캠핑장 이름
    //private String siteName;        // 사이트 이름 추가
    private Date reservationDate;   // 방문 예정일
    //private Date refundedAt;        // 취소한 날짜
    private Integer refundStatus;   // 환불 상태 숫자 (1,2,3,4)
    private Map<String, List<String>> campgroundImage;
   

    
    
//    private Integer paymentAmount;
//    private String paymentMethod;
//    private String paymentStatus;


}
