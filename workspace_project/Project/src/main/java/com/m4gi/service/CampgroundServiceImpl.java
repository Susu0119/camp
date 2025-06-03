package com.m4gi.service;

import java.time.LocalDate;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundFilterRequestDTO;
import com.m4gi.dto.CampgroundSearchDTO;
import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.mapper.CampgroundMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampgroundServiceImpl implements CampgroundService{
	
	private final CampgroundMapper campgroundMapper;
	
	// 캠핑장 검색 목록 조회
	@Override
	public List<CampgroundCardDTO> searchCampgrounds(CampgroundSearchDTO searchDTO, CampgroundFilterRequestDTO filterDTO) {
		// 기본값 설정
		if (searchDTO.getCampgroundName() == null) searchDTO.setCampgroundName("");
		if (searchDTO.getStartDate() == null || searchDTO.getStartDate().trim().isEmpty()) {
			searchDTO.setStartDate(LocalDate.now().toString());
		}
		if (searchDTO.getEndDate() == null || searchDTO.getEndDate().trim().isEmpty()) {
			searchDTO.setEndDate(LocalDate.now().plusDays(1).toString());
		}
		if (searchDTO.getPeople() == 0) searchDTO.setPeople(2); // 기본 인원
		if (searchDTO.getLimit() == 0) searchDTO.setLimit(10);
		if (searchDTO.getOffset() < 0) searchDTO.setOffset(0);

		// 모든 필터가 비어있다면
		boolean isAllFilterEmpty = (filterDTO.getCampgroundTypes() == null || filterDTO.getCampgroundTypes().isEmpty()) &&
                (filterDTO.getSiteEnviroments() == null || filterDTO.getSiteEnviroments().isEmpty()) &&
                (filterDTO.getFeatureList() == null || filterDTO.getFeatureList().isEmpty());
		
		if (isAllFilterEmpty) {
		    // 필터 조건이 아무것도 없으면 전체 검색 (필터링 조건 추가 X)
		    return campgroundMapper.selectSearchedCampgrounds(searchDTO);
		}
	    
		// 필터 조건이 있다면 전체 검색(필터링 조건 추가 O)
	    List<String> filteredIds = campgroundMapper.selectCampgroundIdsByFilter(filterDTO);
	    
	    if (filteredIds == null || filteredIds.isEmpty()) {
	        return Collections.emptyList(); // 결과 없으면 빈 리스트
	    }
	    
	    searchDTO.setCampgroundIdList(filteredIds);
	    return campgroundMapper.selectSearchedCampgrounds(searchDTO);
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
	
	// 캠핑장 구역 상세 페이지 - 캠핑장 지도 url 가져오기
	@Override
	public String getCampgroundMapImage(String campgroundId) {
		return campgroundMapper.selectCampgroundMapImage(campgroundId);
	}
}
