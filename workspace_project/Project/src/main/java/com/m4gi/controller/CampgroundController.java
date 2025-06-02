package com.m4gi.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CampgroundCardDTO;
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
    	    @RequestParam(required = false) List<String> addrSigunguList,
    	    @RequestParam(required = false) String startDate,
    	    @RequestParam(required = false) String endDate,
    	    @RequestParam(required = false) Integer people,
    	    @RequestParam(required = false) Integer providerCode,
    	    @RequestParam(required = false) String providerUserId,
    	    @RequestParam(required = false, defaultValue = "price_high") String sortOption,
    	    @RequestParam(defaultValue = "10") int limit,
    	    @RequestParam(defaultValue = "0") int offset
    		) {
		
		CampgroundSearchDTO dto = new CampgroundSearchDTO();
		dto.setCampgroundName(campgroundName);
	    dto.setAddrSigunguList(addrSigunguList);
	    dto.setStartDate(startDate);
	    dto.setEndDate(endDate);
	    dto.setPeople(people != null ? people : 2);
	    dto.setProviderCode(providerCode != null ? providerCode : 0);
	    dto.setProviderUserId(providerUserId);
	    dto.setSortOption(sortOption);
	    dto.setLimit(limit);
	    dto.setOffset(offset);
		
        List<CampgroundCardDTO> searchedCampgrounds = campgroundService.searchCampgrounds(dto);
        
        if (searchedCampgrounds != null && !searchedCampgrounds.isEmpty()) {
            return new ResponseEntity<>(searchedCampgrounds, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }

    @GetMapping("/{campgroundId}") // URL 경로에서 ID를 받도록 설정

    public ResponseEntity<Map<String, Object>> getCampgroundDetail(@PathVariable String campgroundId) {
        Map<String, Object> campground = campgroundService.getCampgroundDetail(campgroundId);
        if (campground != null && !campground.isEmpty()) {
            return new ResponseEntity<>(campground, HttpStatus.OK);

        } else {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND); // 해당 ID의 캠핑장이 없거나 데이터 조합 실패 시 404 반환
        }
    }
    
    // 캠핑장 구역 상세 페이지 - 캠핑장 지도 이미지 가져오기
    @GetMapping("/{campgroundId}/map-image")
    public ResponseEntity<String> getCampgroundMapImage(@PathVariable String campgroundId) {
    	String mapImageURL = campgroundService.getCampgroundMapImage(campgroundId);
    	
    	if(mapImageURL != null) {
    		return ResponseEntity.ok(mapImageURL);
    	} else {
    		return ResponseEntity.notFound().build();
    	}
    }
    
	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
    @GetMapping("/{campgroundId}/zones/{zoneId}")
    public ResponseEntity<CampgroundZoneDetailDTO> getZoneDetail(
    		@PathVariable String campgroundId,
    		@PathVariable String zoneId
    		) {
    	
    	CampgroundZoneDetailDTO detail = zoneService.getZoneDetail(campgroundId, zoneId);
    	
    	if (detail == null) {
    		return ResponseEntity.notFound().build();
    	}
    	return ResponseEntity.ok(detail);
    }
}
