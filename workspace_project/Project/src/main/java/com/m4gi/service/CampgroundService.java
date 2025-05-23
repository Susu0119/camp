package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.m4gi.dto.CampgroundCardDTO;

public interface CampgroundService {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> searchCampgrounds(String campgroundName, List<String> addrSiGunguList, LocalDate startDate,
			LocalDate endDate, Integer people, Integer providerCode, String providerUserId);

	Map<String, Object> getCampgroundById(String campgroundId);

}
