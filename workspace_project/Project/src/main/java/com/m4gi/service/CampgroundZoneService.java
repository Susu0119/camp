package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.CampgroundZoneDetailDTO;

public interface CampgroundZoneService {
	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
	CampgroundZoneDetailDTO getZoneDetail(int campgroundId, int zoneId);

	// 캠핑장 구역 상세 페이지 - 예약 가능한 사이트 가져오기
	List<String> getAvailableSitesByZoneId(int zoneId, String startDate, String endDate);

	// 특정 날짜에 따른 구역 가격 계산
	Integer calculateZonePrice(int zoneId, String date);

	// 성수기 여부 확인 및 가격 계산
	CampgroundZoneDetailDTO getZoneDetailWithPeakSeason(int campgroundId, int zoneId, String date);
}
