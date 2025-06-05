package com.m4gi.controller;

import com.m4gi.dto.UserDTO;
import com.m4gi.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping("/me")
    public UserDTO getLoginUserInfo(HttpSession session) {
        /*
        // 실제 로그인 완성 시 사용
        Integer providerCode = (Integer) session.getAttribute("provider_code");
        String providerUserId = (String) session.getAttribute("provider_user_id");

        if (providerCode == null || providerUserId == null) {
            throw new RuntimeException("로그인 정보가 없습니다.");
        }
        */
    	
    	System.out.println("🔥 테스트 계정 반환 시작");
        // ✅ 테스트용 하드코딩된 로그인 유저
        int providerCode = 1; // 예: 1 = 카카오
        String providerUserId = "puid_0019";

        return userService.getUserByProvider(providerCode, providerUserId);
    }
}
