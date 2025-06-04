package com.m4gi.service;

import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundCardDTO;
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

		// 4. 캠핑장의 구역 정보 조회 (기본 정보만)
		List<Map<String, Object>> campgroundZones = campgroundMapper.selectCampgroundZones(campgroundId);

		// 5. 모든 정보를 하나의 Map으로 조합
		Map<String, Object> Response = new HashMap<>();
		Response.put("campground", campground); // "campground" 키 아래에 캠핑장 정보
		Response.put("reviews", reviews);       // "reviews" 키 아래에 리뷰 목록
		Response.put("totalReviewCount", totalReviewCount); // "totalReviewCount" 키 아래에 총 리뷰 개수
		Response.put("campgroundZones", campgroundZones); // "campgroundZones" 키 아래에 구역 정보

		return Response;
	}
	
	// 날짜별 예약 가능 여부를 포함한 캠핑장 상세 정보 조회
	@Override
	public Map<String, Object> getCampgroundDetail(String campgroundId, String startDate, String endDate) {
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

		// 4. 캠핑장의 구역 정보 조회 (날짜별 예약 가능 여부 포함)
		List<Map<String, Object>> campgroundZones;
		if (startDate != null && endDate != null) {
			campgroundZones = getCampgroundMaxStock(campgroundId, startDate, endDate);
		} else {
			campgroundZones = campgroundMapper.selectCampgroundZones(campgroundId);
		}

		// 5. 모든 정보를 하나의 Map으로 조합
		Map<String, Object> Response = new HashMap<>();
		Response.put("campground", campground); // "campground" 키 아래에 캠핑장 정보
		Response.put("reviews", reviews);       // "reviews" 키 아래에 리뷰 목록
		Response.put("totalReviewCount", totalReviewCount); // "totalReviewCount" 키 아래에 총 리뷰 개수
		Response.put("campgroundZones", campgroundZones); // "campgroundZones" 키 아래에 구역 정보

		return Response;
	}
	
	// 캠핑장 구역 상세 페이지 - 캠핑장 지도 url 가져오기
	@Override
	public String getCampgroundMapImage(String campgroundId) {
		return campgroundMapper.selectCampgroundMapImage(campgroundId);
	}
	
	// 캠핑장의 구역 정보 가져오기
	@Override
	public List<Map<String, Object>> getCampgroundZones(String campgroundId) {
		return campgroundMapper.selectCampgroundZones(campgroundId);
	}
	
	// 특정 날짜 범위에서 예약 가능한 구역별 사이트 수를 포함한 구역 정보 가져오기
	@Override
	public List<Map<String, Object>> getCampgroundMaxStock(String campgroundId, String startDate, String endDate) {
		// 1. 기본 구역 정보 조회
		List<Map<String, Object>> zones = campgroundMapper.selectCampgroundZones(campgroundId);
		
		// 2. 날짜별 예약 가능 사이트 수 조회
		List<Map<String, Object>> availableSites = campgroundMapper.selectAvailableZoneSites(campgroundId, startDate, endDate);
		
		// 3. 예약 가능 사이트 수를 Map으로 변환 (zone_id -> available_sites)
		Map<String, Integer> availabilityMap = new HashMap<>();
		for (Map<String, Object> site : availableSites) {
			String zoneId = (String) site.get("zone_id");
			Integer availableCount = ((Number) site.get("available_sites")).intValue();
			availabilityMap.put(zoneId, availableCount);
		}
		
		// 4. 기본 구역 정보에 예약 가능 사이트 수 추가
		for (Map<String, Object> zone : zones) {
			String zoneId = (String) zone.get("zone_id");
			Integer availableCount = availabilityMap.getOrDefault(zoneId, 0);
			zone.put("remaining_spots", availableCount);
		}
		
		return zones;
	}
}
