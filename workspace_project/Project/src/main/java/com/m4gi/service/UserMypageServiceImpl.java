package com.m4gi.service;

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

    @Override
    public UserDTO getUserById(int providerCode, String providerUserId) {
        return userMapper.getUserById(providerCode, providerUserId);  // 여기를 getUserById로
    }

    @Override
    public void updateUserProfile(UserDTO user) {
        userMapper.updateUserProfile(user);
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

    //회원 탈퇴
    @Override
    public void deactivateUser(int providerCode, String providerUserId, String reason) {
        userMapper.withdrawUser(providerCode, providerUserId, 1, reason); // 1 = 탈퇴
    }

    @Override
    public UserDTO findByEmail(String email) {
        return userMapper.findByEmail(email);
    }

}
