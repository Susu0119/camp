package com.m4gi.controller;

import com.m4gi.dto.UserDTO;
import com.m4gi.service.UserMypageService;
import com.m4gi.service.VerificationService;
import com.m4gi.util.JwtUtil;
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
    private final JwtUtil jwtUtil;

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
                                        @RequestParam String code) {
        if (!verificationService.verifyCode(email, code)) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증 실패");
        }

        UserDTO user = userMypageService.findByEmail(email);
        if (user == null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자 정보 없음");
        }

        // ✅ JWT 토큰 발급
        String jwt = jwtUtil.generateToken(
                user.getProviderUserId(),  // ✅ kakaoId
                user.getEmail(),
                user.getNickname()
        );

        return ResponseEntity.ok().body(jwt);
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
