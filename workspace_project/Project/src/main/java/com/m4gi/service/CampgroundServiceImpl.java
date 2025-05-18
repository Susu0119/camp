package com.m4gi.service;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundDTO;
import com.m4gi.mapper.CampgroundMapper;

@Service
public class CampgroundServiceImpl implements CampgroundService {
	
	@Autowired
	CampgroundMapper Cmapper;
	
	// 캠핑장 검색 목록 조회
	@Override
	public List<CampgroundDTO> searchCampgrounds(String campgroundName, List<String> addrSiGungu, LocalDate startDate,
			LocalDate endDate, Integer people) {
		// 검색 값 없다면 -> 기본값 설정
		List<String> searchSiGungu = (addrSiGungu == null && addrSiGungu.isEmpty()) ? addrSiGungu : List.of("강남구");
        LocalDate searchStartDate = (startDate == null) ? startDate : LocalDate.now();
        LocalDate searchEndDate = (endDate == null) ? endDate : LocalDate.now().plusDays(1);
        Integer searchPeople = (people == null) ? people : 2;
		
        // LocalDate -> LocalDateTime 변환
        LocalDateTime searchStartDateTime = searchStartDate.atStartOfDay();
        LocalDateTime searchEndDateTime = searchEndDate.atStartOfDay().plusDays(1).minusNanos(1);
        
        // Mapper를 호출하여 데이터베이스에서 검색 필터링된 캠핑장 목록을 조회
        
        // 캠핑장 목록 반환 ? 
		return null;
	}
	
}
