package com.m4gi.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import javax.servlet.http.HttpSession;

import org.springframework.format.annotation.DateTimeFormat;
import com.m4gi.dto.CampgroundDTO;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundFilterRequestDTO;
import com.m4gi.dto.CampgroundSearchDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.service.CampgroundService;
import com.m4gi.service.CampgroundZoneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campgrounds")
public class CampgroundController {

	private final CampgroundService campgroundService;
	private final CampgroundZoneService zoneService;

	// 캠핑장 검색 목록 조회
	@GetMapping("/searchResult")
	public ResponseEntity<List<CampgroundCardDTO>> searchCampgrounds(
			@RequestParam(required = false) String campgroundName,
			@RequestParam(required = false) List<String> locations,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
			@RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
			@RequestParam(required = false) Integer people,
			@RequestParam(required = false, defaultValue = "price_high") String sortOption,
			@RequestParam(defaultValue = "10") int limit,
			@RequestParam(defaultValue = "0") int offset,
			@ModelAttribute CampgroundFilterRequestDTO filterDTO, HttpSession session) {
		
		Integer providerCode = (Integer) session.getAttribute("providerCode");
		String providerUserId = (String) session.getAttribute("providerUserId");

		List<CampgroundCardDTO> searchedCampgrounds = campgroundService.searchCampgrounds(
				campgroundName, locations, startDate, endDate, people, 
				providerCode, providerUserId, sortOption, limit, offset, filterDTO
		);
		
		if (searchedCampgrounds != null && !searchedCampgrounds.isEmpty()) {
			return new ResponseEntity<>(searchedCampgrounds, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NO_CONTENT);
		}
	}

	@GetMapping("/{campgroundId}") // URL 경로에서 ID를 받도록 설정
	public ResponseEntity<Map<String, Object>> getCampgroundDetail(
			@PathVariable int campgroundId,
			@RequestParam(required = false) String startDate,
			@RequestParam(required = false) String endDate) {
		Map<String, Object> campground = campgroundService.getCampgroundDetail(campgroundId, startDate, endDate);
		if (campground != null && !campground.isEmpty()) {
			return new ResponseEntity<>(campground, HttpStatus.OK);
		} else {
			return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 해당 ID의 캠핑장이 없거나 데이터 조합 실패 시 404 반환
		}
	}

	// 캠핑장 구역 상세 페이지 - 캠핑장 지도 이미지 가져오기
	@GetMapping("/{campgroundId}/map-image")
	public ResponseEntity<String> getCampgroundMapImage(@PathVariable int campgroundId) {
		String mapImageURL = campgroundService.getCampgroundMapImage(campgroundId);

		if (mapImageURL != null) {
			return ResponseEntity.ok(mapImageURL);
		} else {
			return ResponseEntity.notFound().build();
		}
	}

	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
	@GetMapping("/{campgroundId}/zones/{zoneId}")
	public ResponseEntity<CampgroundZoneDetailDTO> getZoneDetail(
			@PathVariable int campgroundId,
			@PathVariable int zoneId,
			@RequestParam(required = false) String startDate) {

		CampgroundZoneDetailDTO detail;

		// 날짜가 제공된 경우 성수기 정보 포함
		if (startDate != null) {
			detail = zoneService.getZoneDetailWithPeakSeason(campgroundId, zoneId, startDate);
		} else {
			detail = zoneService.getZoneDetail(campgroundId, zoneId);
		}

		if (detail == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(detail);
	}

	// 캠핑장 정보 가져오기
	@GetMapping("/byId")
	public ResponseEntity<CampgroundDTO> getCampground(@RequestParam int campgroundId) {
		CampgroundDTO campground = campgroundService.getCampgroundId(campgroundId);
		if (campground == null) {
			return ResponseEntity.notFound().build();
		}
		return ResponseEntity.ok(campground);
	}


	@GetMapping("/{campgroundId}/info")
	public ResponseEntity<CampgroundDTO> getCampgroundInfo(
			@PathVariable int campgroundId) {
		CampgroundDTO dto =
				campgroundService.getCampgroundWithUnavailable(campgroundId);
		if (dto == null) {
			return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
		}
		return ResponseEntity.ok(dto);
	}

}
