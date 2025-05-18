package com.m4gi.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.CampgroundDTO;

@RestController
@RequestMapping("/api/campsites")
public class CampgroundController {
	
	// 캠핑장 검색 목록 조회
	@GetMapping
	public List<CampgroundDTO> searchCampgrounds() {
		
		return null;
	}
	
}
