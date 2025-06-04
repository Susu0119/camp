package com.m4gi.mapper;

import java.util.List;
import java.util.Map;

import com.m4gi.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

@Mapper
public interface CampgroundMapper {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> selectSearchedCampgrounds(CampgroundSearchDTO dto);
	
	// 캠핑장 상세 페이지
	Map<String, Object> selectCampgroundById(@Param("campgroundId") String campgroundId);
	List<Map<String, Object>> selectReviewById(@Param("campgroundId") String campgroundId);
	Map<String, Object> getCampgroundDetail(String campgroundId); // 이 메서드가 두 매퍼를 호출하고 결과를 조합
	
	// 캠핑장 구역 상세 페이지
	String selectCampgroundMapImage(@Param("campgroundId") String campgroundId);

	// 캠핑장 정보 가져오기
	CampgroundDTO findCampgroundById(String campgroundId);

}
