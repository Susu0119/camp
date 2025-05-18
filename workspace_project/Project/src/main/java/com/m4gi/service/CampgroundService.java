package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;

import com.m4gi.dto.CampgroundDTO;

public interface CampgroundService {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundDTO> searchCampgrounds(String campgroundName,List<String> addrSiGungu, LocalDate startDate, LocalDate endDate, Integer people);
}
