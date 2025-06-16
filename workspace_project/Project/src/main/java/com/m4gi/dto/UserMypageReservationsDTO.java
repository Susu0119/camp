package com.m4gi.dto;

// 사용자 예약 목록 조회 dto
import java.util.Date;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper; // ObjectMapper는 DTO 자체에서 사용되지 않지만, 다른 곳에서 사용될 수 있으므로 일단 둠.

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class UserMypageReservationsDTO {
    private String reservationId; // 예약 ID
    private String campgroundName; // 캠핑장 이름
    private String addrFull; // 캠핑장 주소
    private Date reservationDate; // 예정일
    private Date endDate; // 종료일
    private int totalPrice; // 예약 총 금액
    private int reservationStatus; // 1:예약완료, 2:취소됨
    // private int checkinStatus; // 아래 @JsonProperty("checkinStatus")와 중복됩니다. 하나만 남기세요.
    private int refundStatus;

    private String campgroundImage; // JSON 문자열 형태로 받음
    private CampgroundImage campgroundImageMap; // JSON 파싱 후 객체로 매핑될 필드

    @Data
    public static class CampgroundImage {
        private List<String> map;
        private List<String> detail;
        private List<String> thumbnail;
    }

   
    @JsonProperty("checkin_status") 
    private int checkinStatus; 
   
    // 캠핑장 구역 정보
    private String zoneName;
    private String zoneType;

    // 예약 사이트 정보
    private String reservationSite; // site_id

    // 인원수 정보
    private Integer totalPeople; // 총 인원수

    private String cancelReason; 
    private String customReason; 
    
    private Integer providerCode; 
    private String providerUserId; 
}