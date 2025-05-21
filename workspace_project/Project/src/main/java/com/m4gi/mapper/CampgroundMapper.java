package com.m4gi.mapper;

import java.time.LocalDate;
import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CampgroundCardDTO;

@Mapper
public interface CampgroundMapper {
	
	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> selectSearchedCampgrounds(
	    @Param("campgroundName") String campgroundName,
	    @Param("addrSiGunguList") List<String> addrSiGunguList,
	    @Param("startDate") LocalDate startDate,
	    @Param("endDate") LocalDate endDate,
	    @Param("people") Integer people,
	    @Param("providerCode") Integer providerCode, // 찜 여부 확인을 위한 providerCode
	    @Param("providerUserId") String providerUserId // 찜 여부 확인을 위한 providerUserId
	);
	
}
