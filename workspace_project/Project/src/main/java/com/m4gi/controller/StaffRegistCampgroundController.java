package com.m4gi.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.service.StaffCampRegisterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/register")
public class StaffRegistCampgroundController {
	
	private final StaffCampRegisterService staffCampRegisterService;
	
	// 캠핑장 등록
	@PostMapping("/campgrounds")
	public ResponseEntity<?> insertCampground(@RequestBody RegistCampgroundDTO dto) {
		try {
			staffCampRegisterService.registerCampground(dto);
	        return ResponseEntity.ok().body("캠핑장 등록 성공");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("등록 실패: " + e.getMessage());
		}
	}
	
	// 구역 등록
	@PostMapping("/zones")
	public ResponseEntity<?> insertZone(@RequestBody RegistZoneDTO dto) {
		try {
			staffCampRegisterService.registerZone(dto);
			return ResponseEntity.ok("존 등록 성공");
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("존 등록 실패: " + e.getMessage());
		}
	}
	
	// 구역 등록 - 성수기 가격 등록
	@PostMapping("/peak-seasons")
	public ResponseEntity<?> insertPeakSeasonPrice(@RequestBody RegistPeakSeasonDTO dto) {
	    try {
	        staffCampRegisterService.registerPeakSeason(dto);
	        return ResponseEntity.ok("성수기 가격 등록 성공");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
	                             .body("성수기 가격 등록 실패: " + e.getMessage());
	    }
	} 
	
	// 사이트 등록
	@PostMapping("/sites")
	public ResponseEntity<?> insertSite(@RequestBody RegistSiteDTO dto) {
	    try {
	        staffCampRegisterService.registerSite(dto);
	        return ResponseEntity.ok("사이트 등록 성공");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사이트 등록 실패: " + e.getMessage());
	    }
	}
	
	
	
	
	
	
	
	
	
}
