package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampingChecklistRequestDTO {

    // 캠핑장 기본 정보 (실제 DB에서 가져오는 정보)
    private int campgroundId;
    private String campgroundName;
    private String campgroundPhone;
    private String addrFull; // 전체 주소
    private LocalDateTime checkinTime; // 체크인 시간
    private LocalDateTime checkoutTime; // 체크아웃 시간

    // 캠핑장 구역 정보 (실제 예약에서 선택되는 정보)
    private int zoneId;
    private String zoneName;
    private String zoneType; // 구역 타입
    private Integer capacity; // 수용 인원

    // 예약 정보 (실제 예약 테이블 정보)
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int totalPeople;

    // 날씨 정보는 실시간 API에서 자동으로 가져옴

    // 편의 메서드
    public String getLocationInfo() {
        return addrFull != null ? addrFull : "";
    }
}