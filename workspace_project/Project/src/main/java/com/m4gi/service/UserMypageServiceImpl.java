package com.m4gi.service;

import java.util.Random;

import org.springframework.stereotype.Service;

import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserMypageServiceImpl implements UserMypageService {
	
	private final UserMapper userMapper;

	//프로필 사진 변경 
    @Override
    public void updateUserProfile(UserDTO user) {
        // 기본 이미지가 없다면, 무작위로 선택
        if (user.getProfileImage() == null || user.getProfileImage().isEmpty()) {
            String[] defaults = {
                "/profile/default1.png",
                "/profile/default2.png",
                "/profile/default3.png"
            };
            int rand = new Random().nextInt(defaults.length);
            user.setProfileImage(defaults[rand]);
        }
        userMapper.updateUserProfile(user);
    }

    @Override
    public UserDTO getUserById(int providerCode, String providerUserId) {
        return userMapper.getUserById(providerCode, providerUserId);
    }
	
    //닉네임 변경 
    @Override
    public void updateUserNickname(UserDTO user) {
        userMapper.updateUserNickname(user);
    }

    //회원 탈퇴
    @Override
    public void deactivateUser(int providerCode, String providerUserId, String reason) {
        userMapper.updateUserStatus(providerCode, providerUserId, 1, reason); // 1 = 탈퇴
    }

    @Override
    public UserDTO findByEmail(String email) {
        return userMapper.findByEmail(email);
    }


}
