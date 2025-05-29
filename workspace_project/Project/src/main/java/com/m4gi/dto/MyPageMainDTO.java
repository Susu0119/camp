package com.m4gi.dto;

import lombok.Builder;
import lombok.Data;

@Data
@Builder
public class MyPageMainDTO {
	
	private String nickname;
    private String profileImage;
    private boolean isFirstVisit; //사용자의 마이페이지 진입 횟수
}
