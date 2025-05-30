package com.m4gi.service;

import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.javanet.NetHttpTransport;
import com.google.api.services.gmail.Gmail;
import com.m4gi.util.EmailTemplateLoader;
import com.m4gi.util.GoogleAuthorizationUtil;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.mail.internet.MimeMessage;
import java.util.HashMap;
import java.util.Map;
import java.util.Random;

@Slf4j
@Service
public class VerificationServiceImpl implements VerificationService {

    private final Map<String, String> verificationStore = new HashMap<>();

    @Override
    public boolean sendCode(String phoneOrEmail) {
        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        verificationStore.put(phoneOrEmail, code); // 메모리에 저장

        try {
            // ✅ HTTP_TRANSPORT 직접 생성 후 getCredential 호출
            NetHttpTransport HTTP_TRANSPORT = new NetHttpTransport();
            Credential credential = GoogleAuthorizationUtil.getCredential(HTTP_TRANSPORT);

            // ✅ Gmail 서비스 인스턴스 생성
            Gmail gmail = GmailService.getGmailService(credential);

            // ✅ 이메일 템플릿 불러와서 코드 삽입
            String htmlTemplate = EmailTemplateLoader.loadTemplate("email.html");
            String emailBody = htmlTemplate.replace("${code}", code);

            // ✅ 이메일 생성
            MimeMessage message = GmailService.createEmailWithHtml(
                    phoneOrEmail,
                    "me",
                    "캠핑플랫폼",
                    "회원 인증번호",
                    emailBody
            );

            // ✅ 이메일 전송
            GmailService.sendMessage(gmail, "me", message);
            return true;

        } catch (Exception e) {
            log.error("이메일 인증번호 전송 실패", e);
            return false;
        }
    }

    @Override
    public boolean verifyCode(String phoneOrEmail, String inputCode) {
        String savedCode = verificationStore.get(phoneOrEmail);
        return savedCode != null && savedCode.equals(inputCode);
    }
}
