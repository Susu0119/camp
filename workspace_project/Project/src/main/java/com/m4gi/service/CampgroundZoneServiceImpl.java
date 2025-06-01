package com.m4gi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.mapper.CampgroundZoneMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampgroundZoneServiceImpl implements CampgroundZoneService {
	
	private final CampgroundZoneMapper campgroundZoneMapper;
	
	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
	@Override
	public CampgroundZoneDetailDTO getZoneDetail(String zoneId) {
		CampgroundZoneDetailDTO zoneDetail = campgroundZoneMapper.selectZoneDetailByZoneId(zoneId);
		if(zoneDetail == null) {
			return null;
		}
		
		List<CampgroundSiteDTO> sites = campgroundZoneMapper.selectSitesDetailByZoneId(zoneId);
		zoneDetail.setSites(sites);
		
		List<ReviewDTO> reviews = campgroundZoneMapper.selectReviewsByZoneId(zoneId);
		zoneDetail.setReviews(reviews);
		
		return zoneDetail;
	}
	
	// 캠핑장 구역 상세 페이지 - 예약 가능한 사이트 가져오기
	@Override
	public List<String> getAvailableSitesByZoneId(String zoneId, String startDate, String endDate) {
		Map<String, Object> params = new HashMap<>();
		params.put("zoneId", zoneId);
		params.put("startDate", startDate);
		params.put("endDate", endDate);
		
		return campgroundZoneMapper.selectAvailableSitesByZoneId(params);
	}
	
}
