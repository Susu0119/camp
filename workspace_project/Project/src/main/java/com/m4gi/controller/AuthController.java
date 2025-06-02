package com.m4gi.controller;

import com.m4gi.dto.UserDTO;
import com.m4gi.service.UserMypageService;
import com.m4gi.service.VerificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/auth")
public class AuthController {

    private final VerificationService verificationService;
    private final UserMypageService userMypageService;

    // ✅ 인증번호 전송 (이메일 기반)
    @PostMapping("/send-code")
    public ResponseEntity<String> sendCode(@RequestParam String email) {
        boolean sent = verificationService.sendCode(email);
        if (sent) {
            return ResponseEntity.ok("인증번호 전송 완료");
        } else {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("전송 실패");
        }
    }

    // ✅ 인증번호 확인 + 세션 저장 (이메일 기반)
    @PostMapping("/verify-code")
    public ResponseEntity<?> verifyCode(@RequestParam String email,
            @RequestParam String code,
            HttpSession session) {
        if (!verificationService.verifyCode(email, code)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }

        UserDTO user = userMypageService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보 없음");
        }

        // ✅ 세션에 사용자 정보 저장
        session.setAttribute("loginUser", user);
        session.setAttribute("providerCode", user.getProviderCode());
        session.setAttribute("providerUserId", user.getProviderUserId());
        session.setAttribute("userEmail", user.getEmail());
        session.setAttribute("userNickname", user.getNickname());

        // 세션 타임아웃 설정 (30분)
        session.setMaxInactiveInterval(30 * 60);

        return ResponseEntity.ok().body("로그인 성공");
    }

    // ✅ 인증 세션 조회 (테스트용)
    @GetMapping("/session-check")
    public ResponseEntity<String> checkSession(HttpSession session) {
        UserDTO user = (UserDTO) session.getAttribute("loginUser");
        if (user == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 없음");
        }

        return ResponseEntity.ok("세션 유지 중: " + user.getProviderCode() + ", " + user.getProviderUserId());
    }
}
