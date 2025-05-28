package com.m4gi.service;

import com.m4gi.dto.UserDTO;

public interface UserMypageService {
	
	// 프로필 사진 변경
	void updateUserProfile(UserDTO user);
	   UserDTO getUserById(int providerCode, String providerUserId);

    // 닉네임 변경 
	void updateUserNickname(UserDTO user);

	    
}
