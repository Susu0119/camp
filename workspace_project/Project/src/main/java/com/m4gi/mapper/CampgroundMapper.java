package com.m4gi.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundSearchDTO;

@Mapper
public interface CampgroundMapper {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> selectSearchedCampgrounds(CampgroundSearchDTO dto);

	Map<String, Object> selectCampgroundById(@Param("campgroundId") String campgroundId);
	List<Map<String, Object>> selectReviewById(@Param("campgroundId") String campgroundId);
	Map<String, Object> getCampgroundDetail(String campgroundId); // 이 메서드가 두 매퍼를 호출하고 결과를 조합
}
