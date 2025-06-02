package com.m4gi.service;

import java.util.List;
import java.util.Map;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundFilterRequestDTO;
import com.m4gi.dto.CampgroundSearchDTO;

public interface CampgroundService {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> searchCampgrounds(CampgroundSearchDTO dto);
	
	// 캠핑장 검색 결과 필터링
	List<String> getCampgroundIdsByFilter(CampgroundFilterRequestDTO dto);

	Map<String, Object> getCampgroundById(String campgroundId);
	List<Map<String, Object>> getReviewById(String campgroundId); // 리뷰는 여러 개일 수 있으므로 List<Map<String, Object>>로 변경

	// ✨ 통합된 캠핑장 상세 정보를 조회하는 메서드 추가
	Map<String, Object> getCampgroundDetail(String campgroundId); // 이 메서드가 두 매퍼를 호출하고 결과를 조합
}
