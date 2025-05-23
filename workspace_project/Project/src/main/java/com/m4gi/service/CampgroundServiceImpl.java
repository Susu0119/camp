package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.mapper.CampgroundMapper;

@Service
public class CampgroundServiceImpl implements CampgroundService{
	
	@Autowired
	CampgroundMapper Cmapper;
	
	// 캠핑장 검색 목록 조회
	@Override
	public List<CampgroundCardDTO> searchCampgrounds(String campgroundName, List<String> addrSiGunguList, LocalDate startDate,
			LocalDate endDate, Integer people, Integer providerCode, String providerUserId) { // 사용자 정보 받아오는 방법에 따라 수정 필요. 세션?
		// 검색 값 없다면 -> 기본값 설정
		List<String> searchaddrSiGunguList = (addrSiGunguList == null || addrSiGunguList.isEmpty()) ? List.of("강남구") : addrSiGunguList;
		LocalDate searchStartDate = (startDate == null) ? LocalDate.now() : startDate;
        LocalDate searchEndDate = (endDate == null) ? LocalDate.now().plusDays(1) : endDate;
        Integer searchPeople = (people == null) ? 2 : people;
        
        // Mapper를 호출하여 데이터베이스에서 검색 필터링된 캠핑장 목록을 조회
        List<CampgroundCardDTO> searchedCampgroundsList = Cmapper.selectSearchedCampgrounds(campgroundName, searchaddrSiGunguList, searchStartDate, searchEndDate, searchPeople, providerCode, providerUserId);
        
        // 캠핑장 목록 반환 
		return searchedCampgroundsList;
	}
	
}
