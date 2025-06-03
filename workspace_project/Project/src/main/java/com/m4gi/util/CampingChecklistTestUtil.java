package com.m4gi.util;

import com.m4gi.dto.CampingChecklistRequestDTO;

import java.time.LocalDate;
import java.util.Arrays;

/**
 * 캠핑 준비물 API 테스트를 위한 샘플 데이터 생성 유틸리티
 */
public class CampingChecklistTestUtil {

    /**
     * 가족 캠핑용 샘플 요청 데이터 생성
     */
    public static CampingChecklistRequestDTO createFamilyCampingRequest() {
        CampingChecklistRequestDTO request = new CampingChecklistRequestDTO();

        // 캠핑장 정보
        request.setCampgroundId("CAMP001");
        request.setCampgroundName("서울숲 힐링캠프장");
        request.setAddrFull("서울시 성동구 서울숲길 273");
        request.setAddrSido("서울시");
        request.setAddrSigungu("성동구");
        request.setCampgroundType("AUTO");
        request.setDescription("도심 속 자연 힐링 캠핑장");

        // 구역 정보
        request.setZoneId("ZONE_A01");
        request.setZoneName("가족구역 A-1");
        request.setZoneType("오토캠핑");
        request.setZoneTerrainType("잔디");
        request.setCapacity(6);
        request.setIsActive(true);

        // 예약 정보
        request.setCheckInDate(LocalDate.now().plusDays(14)); // 2주 후
        request.setCheckOutDate(LocalDate.now().plusDays(16)); // 2박 3일
        request.setDuration(2);

        // 인원 정보
        request.setTotalPeople(4);
        request.setAdults(2);
        request.setChildren(2);
        request.setInfants(0);

        // 동반자 정보
        request.setCompanions(Arrays.asList("가족", "아이"));
        request.setHasPets(false);

        // 시설 정보
        request.setHasElectricity(true);
        request.setHasWater(true);
        request.setEnvironments(Arrays.asList("MOUNTAIN", "VALLEY", "KIDS_ALLOWED"));
        request.setFacilities(Arrays.asList("전기", "온수", "화장실", "샤워실", "놀이터"));

        // 날씨 정보
        request.setSeason("여름");
        request.setMinTemperature(22);
        request.setMaxTemperature(28);
        request.setWeatherConditions(Arrays.asList("맑음", "구름조금"));

        // 사용자 선호도
        request.setPreferredActivities(Arrays.asList("바베큐", "놀이", "산책", "별보기"));
        request.setCookingStyle(Arrays.asList("바베큐", "간편식"));
        request.setExperience("초보");
        request.setSpecialRequests(Arrays.asList("아이 안전용품", "모기 방충제"));

        // 추가 정보
        request.setTransportation("자차");
        request.setBudget("중예산");

        return request;
    }

    /**
     * 커플 캠핑용 샘플 요청 데이터 생성
     */
    public static CampingChecklistRequestDTO createCoupleCampingRequest() {
        CampingChecklistRequestDTO request = new CampingChecklistRequestDTO();

        // 캠핑장 정보
        request.setCampgroundId("CAMP002");
        request.setCampgroundName("가평 호수뷰 캠핑장");
        request.setAddrFull("경기도 가평군 청평면 호반로 123");
        request.setAddrSido("경기도");
        request.setAddrSigungu("가평군");
        request.setCampgroundType("GLAMPING");

        // 구역 정보
        request.setZoneId("ZONE_GL01");
        request.setZoneName("글램핑 호수뷰");
        request.setZoneType("글램핑");
        request.setZoneTerrainType("데크");
        request.setCapacity(2);

        // 예약 정보
        request.setCheckInDate(LocalDate.now().plusDays(21)); // 3주 후
        request.setCheckOutDate(LocalDate.now().plusDays(22)); // 1박 2일
        request.setDuration(1);

        // 인원 정보
        request.setTotalPeople(2);
        request.setAdults(2);
        request.setChildren(0);
        request.setInfants(0);

        // 동반자 정보
        request.setCompanions(Arrays.asList("연인"));
        request.setHasPets(false);

        // 시설 정보
        request.setHasElectricity(true);
        request.setHasWater(true);
        request.setEnvironments(Arrays.asList("WATER_FOUNTAIN", "FOREST", "CITY_VIEW"));

        // 날씨 정보
        request.setSeason("가을");
        request.setMinTemperature(12);
        request.setMaxTemperature(18);
        request.setWeatherConditions(Arrays.asList("맑음"));

        // 사용자 선호도
        request.setPreferredActivities(Arrays.asList("바베큐", "낚시", "사진촬영", "휴식"));
        request.setCookingStyle(Arrays.asList("바베큐", "버너요리"));
        request.setExperience("중급");

        // 추가 정보
        request.setTransportation("자차");
        request.setBudget("고예산");

        return request;
    }

    /**
     * 겨울 캠핑용 샘플 요청 데이터 생성
     */
    public static CampingChecklistRequestDTO createWinterCampingRequest() {
        CampingChecklistRequestDTO request = new CampingChecklistRequestDTO();

        // 캠핑장 정보
        request.setCampgroundId("CAMP003");
        request.setCampgroundName("강원도 설악산 윈터캠프");
        request.setAddrFull("강원도 속초시 설악산로 1234");
        request.setAddrSido("강원도");
        request.setAddrSigungu("속초시");
        request.setCampgroundType("CAMPING");

        // 구역 정보
        request.setZoneId("ZONE_W01");
        request.setZoneName("윈터 구역");
        request.setZoneType("일반캠핑");
        request.setZoneTerrainType("자갈");
        request.setCapacity(4);

        // 예약 정보
        request.setCheckInDate(LocalDate.now().plusDays(60)); // 2개월 후 (겨울)
        request.setCheckOutDate(LocalDate.now().plusDays(62)); // 2박 3일
        request.setDuration(2);

        // 인원 정보
        request.setTotalPeople(3);
        request.setAdults(3);
        request.setChildren(0);
        request.setInfants(0);

        // 동반자 정보
        request.setCompanions(Arrays.asList("친구"));
        request.setHasPets(false);

        // 시설 정보
        request.setHasElectricity(false); // 겨울 캠핑은 전기 없는 경우
        request.setHasWater(false);
        request.setEnvironments(Arrays.asList("MOUNTAIN"));

        // 날씨 정보
        request.setSeason("겨울");
        request.setMinTemperature(-10);
        request.setMaxTemperature(-2);
        request.setWeatherConditions(Arrays.asList("눈", "바람"));

        // 사용자 선호도
        request.setPreferredActivities(Arrays.asList("등산", "사진촬영", "별보기"));
        request.setCookingStyle(Arrays.asList("버너요리", "간편식"));
        request.setExperience("고급");
        request.setSpecialRequests(Arrays.asList("혹한기 장비", "고칼로리 음식"));

        // 추가 정보
        request.setTransportation("자차");
        request.setBudget("중예산");

        return request;
    }
}