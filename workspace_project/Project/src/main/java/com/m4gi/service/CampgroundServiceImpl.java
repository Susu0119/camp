package com.m4gi.service;

import java.time.LocalDate;
import java.util.HashMap;
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

	@Override
	public List<Map<String, Object>> getReviewById(String campgroundId) {
		return campgroundMapper.selectReviewById(campgroundId);
	}

	@Override
	public Map<String, Object> getCampgroundDetail(String campgroundId) {
		// 1. 캠핑장 상세 정보 및 찜 개수 조회
		Map<String, Object> campground = campgroundMapper.selectCampgroundById(campgroundId);

		// 캠핑장 정보가 없으면 더 이상 진행할 필요 없음
		if (campground == null || campground.isEmpty()) {
			return null;
		}

		// 2. 해당 캠핑장의 리뷰 목록 및 리뷰 총 개수 조회
		List<Map<String, Object>> reviews = campgroundMapper.selectReviewById(campgroundId);

		// 3. 리뷰 총 개수 계산 (리뷰 목록이 비어있을 수도 있음)
		int totalReviewCount = (reviews != null) ? reviews.size() : 0;

		// 4. 모든 정보를 하나의 Map으로 조합
		Map<String, Object> Response = new HashMap<>();
		Response.put("campground", campground); // "campground" 키 아래에 캠핑장 정보
		Response.put("reviews", reviews);       // "reviews" 키 아래에 리뷰 목록
		Response.put("totalReviewCount", totalReviewCount); // "totalReviewCount" 키 아래에 총 리뷰 개수

		return Response;
	}
	
}
