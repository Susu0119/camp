package com.m4gi.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.CampgroundCardDTO;
import com.m4gi.service.CampgroundService;

@RestController
@RequestMapping("/api/campgrounds")
public class CampgroundController {
	@Autowired
	CampgroundService CService;
	
	// 캠핑장 검색 목록 조회
	@GetMapping("/search")
    public ResponseEntity<List<CampgroundCardDTO>> searchCampgrounds(
    		@RequestParam(value = "campgroundName", required = false) String campgroundName,
            @RequestParam(value = "addrSigunguList", required = false) List<String> addrSiGunguList,
            @RequestParam(value = "startDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate startDate,
            @RequestParam(value = "endDate", required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate endDate,
            @RequestParam(value = "people", required = false) Integer people,
            @RequestParam(value = "providerCode", required = false) Integer providerCode,
            @RequestParam(value = "providerUserId", required = false) String providerUserId
    		) {

        List<CampgroundCardDTO> searchedCampgrounds = CService.searchCampgrounds(campgroundName, addrSiGunguList, startDate, endDate, people, providerCode, providerUserId);

        if (searchedCampgrounds != null && !searchedCampgrounds.isEmpty()) {
            return new ResponseEntity<>(searchedCampgrounds, HttpStatus.OK);
        } else {
            return new ResponseEntity<>(HttpStatus.NO_CONTENT);
        }
    }
}
