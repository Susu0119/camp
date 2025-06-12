package com.m4gi.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;

import javax.servlet.http.HttpSession;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/test-auth")
public class TestAuthController {

    @Autowired
    private UserMapper userMapper;

    @PostMapping("/login")
    public ResponseEntity<?> testLogin(@RequestBody Map<String, String> request, HttpSession session) {
        String providerUserId = request.get("providerUserId");

        if (providerUserId == null || providerUserId.isBlank()) {
            return ResponseEntity.badRequest().body("providerUserId는 필수입니다.");
        }

        // 테스트용 사용자 생성 또는 조회
        UserDTO user = userMapper.findByProvider(1, providerUserId);
        if (user == null) {
            // 새로운 테스트 사용자 생성
            user = new UserDTO();
            user.setProviderCode(1);
            user.setProviderUserId(providerUserId);
            user.setEmail("test_" + providerUserId + "@test.com");
            user.setNickname("테스트유저");
            user.setPoint(0);
            user.setChecklistAlert(true);
            user.setReservationAlert(true);
            user.setVacancyAlert(true);
            user.setUserRole(1);
            userMapper.insertUser(user);
        }

        // 세션에 사용자 정보 저장
        session.setAttribute("loginUser", user);
        session.setAttribute("providerCode", user.getProviderCode());
        session.setAttribute("providerUserId", user.getProviderUserId());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userNickname", user.getNickname());

        // 세션 타임아웃 설정 (30분)
        session.setMaxInactiveInterval(30 * 60);

        Map<String, Object> response = new HashMap<>();
        response.put("message", "테스트 로그인 성공");
        response.put("user", user);
        response.put("sessionId", session.getId());

        return ResponseEntity.ok(response);
    }
}