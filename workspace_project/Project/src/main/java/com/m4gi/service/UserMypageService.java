package com.m4gi.service;

import javax.servlet.http.HttpSession;

import com.m4gi.dto.MyPageMainDTO;
import com.m4gi.dto.UserDTO;

public interface UserMypageService {
	
	// 프로필 사진 변경
	void updateUserProfile(UserDTO user);
	   UserDTO getUserById(int providerCode, String providerUserId);

    // 닉네임 변경 
	void updateUserNickname(UserDTO user);

	// 마이페이지 메인 - 사용자 환영 문구 출력 
	MyPageMainDTO getMyPageMain(int providerCode, String providerUserId, HttpSession session);
	
}
