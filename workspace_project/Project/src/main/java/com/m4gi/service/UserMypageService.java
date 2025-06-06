package com.m4gi.service;

import javax.servlet.http.HttpSession;

import com.m4gi.dto.MyPageMainDTO;
import com.m4gi.dto.UserDTO;

public interface UserMypageService {
	
	  // 사용자 정보 조회
    UserDTO getUserById(int providerCode, String providerUserId);

    // 사용자 프로필 업데이트
    void updateUserProfile(UserDTO user);	
	
    //닉네임 중복 여부 체크 
    boolean isNicknameDuplicate(String nickname);
    
    // 닉네임 업데이트 
	void updateUserNickname(UserDTO user);

	// 마이페이지 메인 데이터 조회 - 사용자 환영 문구 출력 
	MyPageMainDTO getMyPageMain(int providerCode, String providerUserId, HttpSession session);

    //회원 탈퇴
    void deactivateUser(int providerCode, String providerUserId, String reason);

    UserDTO findByEmail(String email);
    
    void updateUserProfileImage(int providerCode, String providerUserId, String imageUrl);


}
