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
	CampgroundZoneDetailDTO selectZoneDetailByZoneId(Map<String, Object> params);

	List<CampgroundSiteDTO> selectSitesDetailByZoneId(int zoneId);

	String selectCampgroundMapImage(@Param("campgroundId") int campgroundId);

	List<ReviewDTO> selectReviewsByZoneId(int zoneId);

	List<String> selectAvailableSitesByZoneId(Map<String, Object> params);

}
