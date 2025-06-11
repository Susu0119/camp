package com.m4gi.service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import com.m4gi.dto.*;
import org.springframework.stereotype.Service;

import com.m4gi.mapper.CampgroundMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampgroundServiceImpl implements CampgroundService {

	private final CampgroundMapper campgroundMapper;

	// 캠핑장 검색 목록 조회
	@Override
	public List<CampgroundCardDTO> searchCampgrounds(String campgroundName, List<String> locations, LocalDate startDate,
			LocalDate endDate, Integer people, Integer providerCode, String providerUserId,
			String sortOption, int limit, int offset, CampgroundFilterRequestDTO filterDTO) {
		
		CampgroundSearchDTO searchDTO = new CampgroundSearchDTO();
		
		// 기본값 설정 및 DTO에 값 채우기
		searchDTO.setCampgroundName(campgroundName != null ? campgroundName : "");
		searchDTO.setStartDate(startDate != null ? startDate : LocalDate.now());
		searchDTO.setEndDate(endDate != null ? endDate : LocalDate.now().plusDays(1));
		searchDTO.setPeople(people != null ? people : 2);
		searchDTO.setProviderCode(providerCode != null ? providerCode : 0);
		searchDTO.setProviderUserId(providerUserId);
		searchDTO.setSortOption(sortOption);
		searchDTO.setLimit(limit);
		searchDTO.setOffset(offset);
		
		// "시도:시군구" 문자열 리스트를 List<LocationDTO> 객체 리스트로 변환
		if (locations != null && !locations.isEmpty()) {
			List<LocationDTO> locationPairs = new ArrayList<>();
			for (String loc : locations) {
				String[] parts = loc.split(":"); // "인천:동구" -> ["인천", "동구"]
				if (parts.length == 2) {
					locationPairs.add(new LocationDTO(parts[0], parts[1]));
				}
			}
			searchDTO.setLocations(locationPairs);
		}
		
		// 부가 필터(캠핑장 유형, 환경 등) 처리
		boolean isFilterEmpty = (filterDTO.getCampgroundTypes() == null || filterDTO.getCampgroundTypes().isEmpty()) &&
							    (filterDTO.getSiteEnviroments() == null || filterDTO.getSiteEnviroments().isEmpty()) &&
							    (filterDTO.getFeatureList() == null || filterDTO.getFeatureList().isEmpty());

		if (!isFilterEmpty) {
			List<Integer> filteredIds = campgroundMapper.selectCampgroundIdsByFilter(filterDTO);
			// 필터 결과가 없으면, 검색 결과도 없어야 하므로 빈 리스트를 반환
			if (filteredIds == null || filteredIds.isEmpty()) {
				return Collections.emptyList();
			}
			searchDTO.setCampgroundIdList(filteredIds);
		}
		
		return campgroundMapper.selectSearchedCampgrounds(searchDTO);
	}

	@Override
	public Map<String, Object> getCampgroundById(int campgroundId) {
		return campgroundMapper.selectCampgroundById(campgroundId);
	}

	@Override
	public List<Map<String, Object>> getReviewById(int campgroundId) {
		return campgroundMapper.selectReviewById(campgroundId);
	}

	@Override
	public Map<String, Object> getCampgroundDetail(int campgroundId) {
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
		Response.put("reviews", reviews); // "reviews" 키 아래에 리뷰 목록
		Response.put("totalReviewCount", totalReviewCount); // "totalReviewCount" 키 아래에 총 리뷰 개수
		Response.put("campgroundZones", campgroundZones); // "campgroundZones" 키 아래에 구역 정보

		return Response;
	}

	// 날짜별 예약 가능 여부를 포함한 캠핑장 상세 정보 조회
	@Override
	public Map<String, Object> getCampgroundDetail(int campgroundId, String startDate, String endDate) {
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
		Response.put("reviews", reviews); // "reviews" 키 아래에 리뷰 목록
		Response.put("totalReviewCount", totalReviewCount); // "totalReviewCount" 키 아래에 총 리뷰 개수
		Response.put("campgroundZones", campgroundZones); // "campgroundZones" 키 아래에 구역 정보

		return Response;
	}

	// 캠핑장 구역 상세 페이지 - 캠핑장 지도 url 가져오기
	@Override
	public String getCampgroundMapImage(int campgroundId) {
		return campgroundMapper.selectCampgroundMapImage(campgroundId);
	}

	// 캠핑장 정보 가져오기
	@Override
	public CampgroundDTO getCampgroundId(int campgroundId) {
		return campgroundMapper.findCampgroundById(campgroundId);
	}

	// 캠핑장의 구역 정보 가져오기
	@Override
	public List<Map<String, Object>> getCampgroundZones(int campgroundId) {
		return campgroundMapper.selectCampgroundZones(campgroundId);
	}

	// 특정 날짜 범위에서 예약 가능한 구역별 사이트 수를 포함한 구역 정보 가져오기
	@Override
	public List<Map<String, Object>> getCampgroundMaxStock(int campgroundId, String startDate, String endDate) {
		// 1. 기본 구역 정보 조회
		List<Map<String, Object>> zones = campgroundMapper.selectCampgroundZones(campgroundId);

		// 2. 날짜별 예약 가능 사이트 수 조회
		List<Map<String, Object>> availableSites = campgroundMapper.selectAvailableZoneSites(campgroundId, startDate,
				endDate);

		// 3. 예약 가능 사이트 수를 Map으로 변환 (zone_id -> available_sites)
		Map<Integer, Integer> availabilityMap = new HashMap<>();
		for (Map<String, Object> site : availableSites) {
			Integer zoneId = ((Number) site.get("zone_id")).intValue();
			Integer availableCount = ((Number) site.get("available_sites")).intValue();
			availabilityMap.put(zoneId, availableCount);
		}

		// 4. 기본 구역 정보에 예약 가능 사이트 수 추가
		for (Map<String, Object> zone : zones) {
			Integer zoneId = ((Number) zone.get("zone_id")).intValue();
			Integer availableCount = availabilityMap.getOrDefault(zoneId, 0);
			zone.put("remaining_spots", availableCount);
		}

		return zones;
	}

	@Override
	public CampgroundDTO getCampgroundWithUnavailable(int campgroundId) {
		// 1) 기본 정보
		CampgroundDTO dto = campgroundMapper.findCampgroundById(campgroundId);

		// 2) 전체 사이트 수
		int totalSites = campgroundMapper.getTotalSites(campgroundId);

		// 3) 매진일 조회
		Map<String,Object> params = new HashMap<>();
		params.put("campgroundId", campgroundId);
		params.put("totalSites", totalSites);
		List<LocalDate> unavailable = campgroundMapper.getUnavailableDates(params);

		// 4) DTO에 세팅
		dto.setUnavailableDates(unavailable);
		return dto;
	}

}
