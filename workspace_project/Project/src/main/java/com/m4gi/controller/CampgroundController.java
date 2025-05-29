package com.m4gi.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.dto.CampgroundSearchDTO;
import com.m4gi.service.CampgroundService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/campgrounds")
public class CampgroundController {
	private final CampgroundService campgroundService;
	
	// 캠핑장 검색 목록 조회
	@GetMapping("/searchResult")
    public ResponseEntity<List<CampgroundCardDTO>> searchCampgrounds(    
    		@RequestParam(required = false) String campgroundId,
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
}
