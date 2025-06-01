package com.m4gi.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.dto.ReviewDTO;

@Mapper
public interface CampgroundZoneMapper {
	
	// 캠핑장 구역 상세 페이지
	CampgroundZoneDetailDTO selectZoneDetailByZoneId(String zoneId);
	List<CampgroundSiteDTO> selectSitesDetailByZoneId(String zoneId);
	String selectCampgroundMapImage(@Param("campgroundId") String campgroundId);
	List<ReviewDTO> selectReviewsByZoneId(String zoneId);
	List<String> selectAvailableSitesByZoneId(Map<String, Object> params);
	
}
