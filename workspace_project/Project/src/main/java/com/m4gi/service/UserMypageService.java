package com.m4gi.service;

import com.m4gi.dto.UserDTO;

public interface UserMypageService {
	
	// 프로필 사진 변경
	void updateUserProfile(UserDTO user);
	   UserDTO getUserById(int providerCode, String providerUserId);

    // 닉네임 변경 
	void updateUserNickname(UserDTO user);

	//회원 탈퇴
	void deactivateUser(int providerCode, String providerUserId, String reason);

	UserDTO findByPhoneOrEmail(String phoneOrEmail);


}
