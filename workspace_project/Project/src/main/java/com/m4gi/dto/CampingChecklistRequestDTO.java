package com.m4gi.dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class CampingChecklistRequestDTO {

    // 캠핑장 기본 정보 (campgrounds 테이블 기반)
    private String campgroundId;
    private String campgroundName;
    private String campgroundPhone;
    private String campgroundType; // SET 타입: 'CAMPING', 'CARAVAN', 'GLAMPING', 'AUTO', 'CAMPNIC'
    private String addrFull; // 전체 주소
    private String addrSido; // 시도
    private String addrSigungu; // 시군구
    private String description; // 캠핑장 설명
    private List<String> environments; // SET 타입을 List로: 환경 정보
    private Double totalAreaSqm; // 총 면적
    private LocalDateTime checkinTime; // 체크인 시간
    private LocalDateTime checkoutTime; // 체크아웃 시간
    private Double latitude; // 위도
    private Double longitude; // 경도
    private String mapService; // 지도 서비스

    // 캠핑장 구역 정보 (campground_zones 테이블 기반)
    private String zoneId;
    private String zoneName;
    private String zoneDescription;
    private Integer capacity; // 수용 인원
    private String zoneType; // 구역 타입
    private String zoneTerrainType; // 지형 타입
    private Boolean isActive;
    private Integer defaultWeekdayPrice; // 평일 가격
    private Integer defaultWeekendPrice; // 주말 가격

    // 예약 정보
    private LocalDate checkInDate;
    private LocalDate checkOutDate;
    private int duration; // 숙박 일수

    // 인원 정보
    private int totalPeople;
    private int adults;
    private int children;
    private int infants;

    // 동반자 정보
    private List<String> companions; // ex: ["가족", "친구", "연인", "혼자"]
    private boolean hasPets;
    private String petInfo; // 반려동물 정보

    // 캠핑장 시설 정보
    private List<String> facilities; // environments와 연동 가능
    private boolean hasElectricity;
    private boolean hasWater;

    // 날씨 및 계절 정보
    private String season; // "봄", "여름", "가을", "겨울"
    private List<String> weatherConditions; // ex: ["맑음", "비", "눈", "바람"]
    private int minTemperature;
    private int maxTemperature;

    // 사용자 선호도 및 특별 요구사항
    private List<String> preferredActivities; // ex: ["바베큐", "낚시", "등산", "수영"]
    private List<String> cookingStyle; // ex: ["바베큐", "버너요리", "간편식"]
    private String experience; // "초보", "중급", "고급"
    private List<String> specialRequests; // 특별 요구사항

    // 추가 정보
    private String transportation; // "자차", "대중교통"
    private String budget; // "저예산", "중예산", "고예산"

    // 편의 메서드들
    public String getFullAddress() {
        if (addrFull != null) {
            return addrFull;
        }
        if (addrSido != null && addrSigungu != null) {
            return addrSido + " " + addrSigungu;
        }
        return addrSido != null ? addrSido : "";
    }

    public String getLocationInfo() {
        return getFullAddress();
    }

    public String getSiteType() {
        // 기존 호환성을 위해 유지
        if (zoneType != null) {
            return zoneType;
        }
        if (campgroundType != null) {
            // campgroundType을 한국어로 변환
            switch (campgroundType.toLowerCase()) {
                case "camping":
                    return "일반캠핑";
                case "caravan":
                    return "카라반";
                case "glamping":
                    return "글램핑";
                case "auto":
                    return "오토캠핑";
                case "campnic":
                    return "캠프닉";
                default:
                    return campgroundType;
            }
        }
        return "오토캠핑"; // 기본값
    }
}