package com.m4gi.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.mapper.CampgroundMapper;

@Service
public class CampgroundServiceImpl implements CampgroundService{
	
	@Autowired
	CampgroundMapper CMapper;
	
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
        List<CampgroundCardDTO> searchedCampgroundsList = CMapper.selectSearchedCampgrounds(campgroundName, searchaddrSiGunguList, searchStartDate, searchEndDate, searchPeople, providerCode, providerUserId);
        
        // 캠핑장 목록 반환 
		return searchedCampgroundsList;
	}

	@Override
	public Map<String, Object> getCampgroundById(String campgroundId) {
		return CMapper.selectCampgroundById(campgroundId);
	}

	@Override
	public List<Map<String, Object>> getReviewById(String campgroundId) {
		return CMapper.selectReviewById(campgroundId);
	}

	@Override
	public Map<String, Object> getCampgroundDetail(String campgroundId) {
		// 1. 캠핑장 상세 정보 및 찜 개수 조회
		Map<String, Object> campground = CMapper.selectCampgroundById(campgroundId);

		// 캠핑장 정보가 없으면 더 이상 진행할 필요 없음
		if (campground == null || campground.isEmpty()) {
			return null;
		}

		// 2. 해당 캠핑장의 리뷰 목록 및 리뷰 총 개수 조회
		List<Map<String, Object>> reviews = CMapper.selectReviewById(campgroundId);

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
