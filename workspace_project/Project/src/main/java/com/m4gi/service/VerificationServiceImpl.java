package com.m4gi.service;

import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service
public class VerificationServiceImpl implements VerificationService {

    private final Map<String, String> verificationStore = new HashMap<>();

    @Override
    public boolean sendCode(String phoneOrEmail) {
        // 테스트용 코드 생성 (랜덤 6자리 숫자)
        String code = String.valueOf(new Random().nextInt(900000) + 100000);

        // 콘솔 로그로 대체 (실제 구현시 카카오 알림톡 등 연동)
        log.info("[테스트 인증번호] 대상: {} → 인증번호: {}", phoneOrEmail, code);

        verificationStore.put(phoneOrEmail, code);
        return true;
    }


    @Override
    public boolean verifyCode(String phoneOrEmail, String inputCode) {
        String savedCode = verificationStore.get(phoneOrEmail);
        return savedCode != null && savedCode.equals(inputCode);
    }
}
