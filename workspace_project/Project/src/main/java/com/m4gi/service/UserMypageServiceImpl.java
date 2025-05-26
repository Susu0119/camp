package com.m4gi.service;

import java.util.Random;

import javax.servlet.http.HttpSession;

import org.springframework.stereotype.Service;

import com.m4gi.dto.MyPageMainDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserMypageServiceImpl implements UserMypageService {

    private final UserMapper userMapper;

    // 프로필 사진 변경
    @Override
    public void updateUserProfile(UserDTO user) {
        if (user == null) {
            throw new IllegalArgumentException("user 객체가 null입니다.");
        }

        // 기본 이미지가 없다면 무작위로 선택
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

    // providerCode와 providerUserId로 사용자 정보 조회
    @Override
    public UserDTO getUserById(int providerCode, String providerUserId) {
        if (providerUserId == null || providerUserId.isEmpty()) {
            throw new IllegalArgumentException("providerUserId는 null이거나 비어있을 수 없습니다.");
        }
        return userMapper.getUserById(providerCode, providerUserId);
    }

    // 닉네임 변경
    @Override
    public void updateUserNickname(UserDTO user) {
        if (user == null) {
            throw new IllegalArgumentException("user 객체가 null입니다.");
        }
        userMapper.updateUserNickname(user);
    }

    // 마이페이지 메인 - 사용자 환영 문구 출력
    @Override
    public MyPageMainDTO getMyPageMain(int providerCode, String providerUserId, HttpSession session) {
        if (providerUserId == null || providerUserId.isEmpty()) {
            throw new IllegalArgumentException("providerUserId는 null이거나 비어있을 수 없습니다.");
        }
        if (session == null) {
            throw new IllegalArgumentException("session은 null일 수 없습니다.");
        }

        // DB에서 사용자 정보 조회
        UserDTO user = userMapper.getUserById(providerCode, providerUserId);

        // 조회 결과가 없을 경우 null 방어
        if (user == null) {
            throw new IllegalStateException("해당 사용자를 찾을 수 없습니다: providerCode=" 
                    + providerCode + ", providerUserId=" + providerUserId);
        }

        boolean isFirstVisit = false;

        // 세션에서 "myPageVisited" 확인 -> 없으면 첫 방문으로 간주하고 세션에 저장
        if (session.getAttribute("myPageVisited") == null) {
            isFirstVisit = true;
            session.setAttribute("myPageVisited", true);
        }

        // 결과 DTO 반환
        return MyPageMainDTO.builder()
                .nickname(user.getNickname())
                .profileImage(user.getProfileImage())
                .isFirstVisit(isFirstVisit)
                .build();
    }

}
