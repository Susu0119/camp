package com.m4gi.mapper;

import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundSearchDTO;
import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.dto.ReviewDTO;

@Mapper
public interface CampgroundMapper {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> selectSearchedCampgrounds(CampgroundSearchDTO dto);

	Map<String, Object> selectCampgroundById(@Param("campgroundId") String campgroundId);
	List<Map<String, Object>> selectReviewById(@Param("campgroundId") String campgroundId);
	Map<String, Object> getCampgroundDetail(String campgroundId); // 이 메서드가 두 매퍼를 호출하고 결과를 조합
	
	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
	CampgroundZoneDetailDTO selectZoneDetailByZoneId(String zoneId);
	List<CampgroundSiteDTO> selectSitesDetailByZoneId(String zoneId);
	List<ReviewDTO> selectReviewsByZoneId(String zoneId);
	
}
