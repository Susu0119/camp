package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundSearchDTO;
import com.m4gi.mapper.CampgroundMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampgroundServiceImpl implements CampgroundService{
	
	private final CampgroundMapper campgroundMapper;
	
	// 캠핑장 검색 목록 조회
	@Override
	public List<CampgroundCardDTO> searchCampgrounds(CampgroundSearchDTO dto) {
	    // 기본값 설정
	    if (dto.getCampgroundName() == null) dto.setCampgroundName("");
	    if (dto.getAddrSigunguList() == null || dto.getAddrSigunguList().isEmpty()) {
	        dto.setAddrSigunguList(List.of("강남구")); // 기본값
	    }
	    if (dto.getStartDate() == null) dto.setStartDate(LocalDate.now().toString());
	    if (dto.getEndDate() == null) dto.setEndDate(LocalDate.now().plusDays(1).toString());
	    if (dto.getPeople() == 0) dto.setPeople(2); // 기본 인원
	    if (dto.getLimit() == 0) dto.setLimit(10);
	    if (dto.getOffset() < 0) dto.setOffset(0);
        
        // Mapper를 호출하여 데이터베이스에서 검색 필터링된 캠핑장 목록을 조회 => 캠핑장 목록 반환 
		return campgroundMapper.selectSearchedCampgrounds(dto);
	}
	
	@Override
	public Map<String, Object> getCampgroundById(String campgroundId) {
		return campgroundMapper.selectCampgroundById(campgroundId);
	}
	
}
