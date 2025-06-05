package com.m4gi.dto;

import java.util.List;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CampgroundFilterRequestDTO {
	private List<String> campgroundTypes;	// 숙소 유형
	
	private List<String> siteEnviroments;	// 사이트 지형 유형
	
	private List<String> featureList;		// 공용/편의시설, 이용 가능 조건, 주변환경 조건
}
