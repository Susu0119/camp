package com.m4gi.mapper;

import java.time.LocalDateTime;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CampgroundDTO;

@Mapper
public interface CampgroundMapper {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundDTO> selectSearchedCampgrounds(
		@Param("campgroundName") String campgroundName,
		@Param("addrSiGunguList") List<String> addrSiGunguList,
		@Param("startDate") LocalDateTime startDate,
		@Param("endDate") LocalDateTime endDate,
		@Param("people") Integer people
	);
		
}
