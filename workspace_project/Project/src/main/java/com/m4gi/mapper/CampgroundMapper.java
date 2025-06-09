package com.m4gi.mapper;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import com.m4gi.dto.*;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundFilterRequestDTO;
import com.m4gi.dto.CampgroundSearchDTO;
import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.dto.ReviewDTO;

@Mapper
public interface CampgroundMapper {

	// 캠핑장 검색 목록 조회
	List<CampgroundCardDTO> selectSearchedCampgrounds(CampgroundSearchDTO dto);

	// 캠핑장 검색 목록 필터링
	List<Integer> selectCampgroundIdsByFilter(CampgroundFilterRequestDTO dto);

	// 캠핑장 상세 페이지
	Map<String, Object> selectCampgroundById(@Param("campgroundId") int campgroundId);

	List<Map<String, Object>> selectReviewById(@Param("campgroundId") int campgroundId);

	Map<String, Object> getCampgroundDetail(int campgroundId);

	// 캠핑장 구역 상세 페이지
	String selectCampgroundMapImage(@Param("campgroundId") int campgroundId);

	// 캠핑장 정보 가져오기
	CampgroundDTO findCampgroundById(int campgroundId);

	// 캠핑장의 구역 정보 가져오기
	List<Map<String, Object>> selectCampgroundZones(@Param("campgroundId") int campgroundId);

	// 특정 날짜 범위에서 예약 가능한 구역별 사이트 수 계산
	List<Map<String, Object>> selectAvailableZoneSites(@Param("campgroundId") int campgroundId,
			@Param("startDate") String startDate,
			@Param("endDate") String endDate);

	// 사이트 ID로 구역 ID 찾기
	Integer selectZoneIdBySiteId(@Param("siteId") String siteId);

	// 구역 ID로 캠핑장 ID 찾기
	Integer selectCampgroundIdByZoneId(@Param("zoneId") int zoneId);

	// 캠핑장 정보 조회 (문자열 ID 사용)
	CampgroundDTO findCampgroundById(
			@Param("campgroundId") String campgroundId
	);

	// 전체 사이트 수 조회
	int getTotalSites(
			@Param("campgroundId") String campgroundId
	);

	// reservation_date ~ end_date 모두 블록할 불가일 리스트 조회
	List<LocalDate> getUnavailableDates(
			Map<String, Object> params
	);


}