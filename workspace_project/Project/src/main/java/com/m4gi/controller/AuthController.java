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
    public ResponseEntity<String> verifyCode(@RequestParam String email,
                                             @RequestParam String code,
                                             HttpSession session) {
        if (!verificationService.verifyCode(email, code)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }

        UserDTO user = userMypageService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보 없음");
        }

        session.setAttribute("provider_code", user.getProviderCode());
        session.setAttribute("provider_user_id", user.getProviderUserId());

        return ResponseEntity.ok("인증 성공");
    }

    // ✅ 인증 세션 조회 (테스트용)
    @GetMapping("/session-check")
    public ResponseEntity<String> checkSession(HttpSession session) {
        Object code = session.getAttribute("provider_code");
        Object id = session.getAttribute("provider_user_id");
        if (code != null && id != null) {
            return ResponseEntity.ok("세션 유지 중: " + code + ", " + id);
        }
        return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("세션 없음");
    }
}
