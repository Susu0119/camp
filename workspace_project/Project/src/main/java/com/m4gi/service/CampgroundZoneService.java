package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.CampgroundZoneDetailDTO;

public interface CampgroundZoneService {
	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
	CampgroundZoneDetailDTO getZoneDetail(String campgroundId, String zoneId);
	
	// 캠핑장 구역 상세 페이지 - 예약 가능한 사이트 가져오기
	List<String> getAvailableSitesByZoneId(String zoneId, String startDate, String endDate);
}
