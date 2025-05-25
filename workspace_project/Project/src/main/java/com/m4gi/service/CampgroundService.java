package com.m4gi.service;

import java.util.List;
import java.util.Map;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundSearchDTO;

public interface CampgroundService {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> searchCampgrounds(CampgroundSearchDTO dto);

	Map<String, Object> getCampgroundById(String campgroundId);

}
