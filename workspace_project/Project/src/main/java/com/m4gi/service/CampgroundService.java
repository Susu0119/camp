package com.m4gi.service;

import java.util.List;
import java.util.Map;

import com.m4gi.dto.*;

public interface CampgroundService {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> searchCampgrounds(CampgroundSearchDTO searchDTO, CampgroundFilterRequestDTO filterDTO);

	Map<String, Object> getCampgroundById(String campgroundId);
	List<Map<String, Object>> getReviewById(String campgroundId); // 리뷰는 여러 개일 수 있으므로 List<Map<String, Object>>로 변경

	Map<String, Object> getCampgroundDetail(String campgroundId); // 이 메서드가 두 매퍼를 호출하고 결과를 조합
	
	// 날짜별 예약 가능 여부를 포함한 캠핑장 상세 정보 조회
	Map<String, Object> getCampgroundDetail(String campgroundId, String startDate, String endDate);
	
	// 캠핑장 지도 url 가져오기 - 캠핑장 구역 상세 페이지
	String getCampgroundMapImage(String campgroundId);

	// 캠핑장 정보 가져오기
	CampgroundDTO getCampgroundId(String campgroundId);

	// 캠핑장의 구역 정보 가져오기
	List<Map<String, Object>> getCampgroundZones(String campgroundId);
	
	// 특정 날짜 범위에서 예약 가능한 구역별 사이트 수를 포함한 구역 정보 가져오기
	List<Map<String, Object>> getCampgroundMaxStock(String campgroundId, String startDate, String endDate);

}
