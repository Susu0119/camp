package com.m4gi.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.service.CampgroundService;
import com.m4gi.service.CampgroundZoneService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/zones")
public class CampgroundZoneController {
	
	private final CampgroundZoneService zoneService;
	
	// 구역 및 사이트 정보 가져오기
    @GetMapping("/{zoneId}")
    public ResponseEntity<CampgroundZoneDetailDTO> getZoneDetail(@PathVariable String zoneId) {
    	
    	CampgroundZoneDetailDTO detail = zoneService.getZoneDetail(zoneId);
    	
    	if (detail == null) {
    		return ResponseEntity.notFound().build();
    	}
    	return ResponseEntity.ok(detail);
    }
    
    // 예약 가능한 사이트 가져오기
    @GetMapping("/{zoneId}/available-sites")
    public List<String> getAvailableSites(
    		@RequestParam String zoneId,
    		@RequestParam String startDate,
    		@RequestParam String endDate
    		) {
    	return zoneService.getAvailableSitesByZoneId(zoneId, startDate, endDate);
    }
	
	
	
}
