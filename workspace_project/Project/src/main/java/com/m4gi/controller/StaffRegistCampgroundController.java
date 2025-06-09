package com.m4gi.controller;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpSession;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.dto.ZoneInfoDTO;
import com.m4gi.service.StaffCampRegisterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/register")
public class StaffRegistCampgroundController {
	
	private final StaffCampRegisterService staffCampRegisterService;
	
	// 캠핑장 등록
	@PostMapping("/campgrounds")
	public ResponseEntity<RegistCampgroundDTO> insertCampground(@RequestBody RegistCampgroundDTO dto, HttpSession session) {
		
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
			String providerUserId = (String) session.getAttribute("providerUserId");
			
			// 세션 정보가 없을 경우의 예외 처리
			if (providerCode == null || providerUserId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
			}
			
			RegistCampgroundDTO createdCampground = staffCampRegisterService.registerCampground(dto, providerCode, providerUserId);
	        return ResponseEntity.ok(createdCampground);
		} catch (Exception e) {
			e.printStackTrace(); 
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	// 구역 등록
	@PostMapping("/zones")
	public ResponseEntity<?> insertZone(@RequestBody RegistZoneDTO dto) {
		try {
			RegistZoneDTO createdZone = staffCampRegisterService.registerZone(dto);
			return ResponseEntity.ok(createdZone);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); 
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
	
	// 구역 조회
	@GetMapping("/my-zones")
	public ResponseEntity<?> getMyZones(HttpSession session) {
	    try {
	        Integer providerCode = (Integer) session.getAttribute("providerCode");
	        String providerUserId = (String) session.getAttribute("providerUserId");

	        if (providerCode == null || providerUserId == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
	        }

	        // 사용자 ID를 이용해 소유한 캠핑장 ID를 DB에서 조회
	        Integer campgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);

	        if (campgroundId == null) {
	            // 소유한 캠핑장이 없는 경우, 빈 목록을 반환
	            return ResponseEntity.ok(Collections.emptyList());
	        }

	        // 조회된 campgroundId로 해당 캠핑장의 존 목록 조회
	        List<ZoneInfoDTO> zones = staffCampRegisterService.findZonesByCampgroundId(campgroundId);
	        return ResponseEntity.ok(zones);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
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
