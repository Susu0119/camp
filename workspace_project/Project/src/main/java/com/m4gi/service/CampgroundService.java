package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.m4gi.dto.*;

public interface CampgroundService {

	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> searchCampgrounds(String campgroundName, List<String> locations, LocalDate startDate,
			LocalDate endDate, Integer people, Integer providerCode, String providerUserId,
			String sortOption, int limit, int offset, CampgroundFilterRequestDTO filterDTO);

	Map<String, Object> getCampgroundById(int campgroundId);

	List<Map<String, Object>> getReviewById(int campgroundId); // 리뷰는 여러 개일 수 있으므로 List<Map<String, Object>>로 변경

	Map<String, Object> getCampgroundDetail(int campgroundId); // 이 메서드가 두 매퍼를 호출하고 결과를 조합

	// 날짜별 예약 가능 여부를 포함한 캠핑장 상세 정보 조회
	Map<String, Object> getCampgroundDetail(int campgroundId, String startDate, String endDate);

	// 캠핑장 지도 url 가져오기 - 캠핑장 구역 상세 페이지
	String getCampgroundMapImage(int campgroundId);

	// 캠핑장 정보 가져오기
	CampgroundDTO getCampgroundId(int campgroundId);

	// 캠핑장의 구역 정보 가져오기
	List<Map<String, Object>> getCampgroundZones(int campgroundId);

	// 특정 날짜 범위에서 예약 가능한 구역별 사이트 수를 포함한 구역 정보 가져오기
	List<Map<String, Object>> getCampgroundMaxStock(int campgroundId, String startDate, String endDate);

}
