package com.m4gi.service;

import com.m4gi.util.EmailTemplateLoader;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import javax.mail.*;
import javax.mail.internet.*;
import java.util.HashMap;
import java.util.Map;
import java.util.Properties;
import java.util.Random;

@Slf4j
@Service
public class VerificationServiceImpl implements VerificationService {

    private final Map<String, String> verificationStore = new HashMap<>();

    @Override
    public boolean sendCode(String email) {
        String code = String.valueOf(new Random().nextInt(900000) + 100000);
        verificationStore.put(email, code);

        try {
            // ✅ SMTP 설정
            Properties props = new Properties();
            props.put("mail.smtp.auth", "true");
            props.put("mail.smtp.starttls.enable", "true");
            props.put("mail.smtp.host", "smtp.gmail.com");
            props.put("mail.smtp.port", "587");

            // ✅ 앱 비밀번호 로그인 정보
            final String senderEmail = "reder78901@gmail.com";
            final String appPassword = "awyo xyyg ornk ftbq"; // 앱 비밀번호 입력

            // ✅ 인증 세션 생성
            Session session = Session.getInstance(props, new Authenticator() {
                @Override
                protected PasswordAuthentication getPasswordAuthentication() {
                    return new PasswordAuthentication(senderEmail, appPassword);
                }
            });

            // ✅ 이메일 템플릿 읽고 치환
            String htmlTemplate = EmailTemplateLoader.loadTemplate("email.html");
            String emailBody = htmlTemplate.replace("${code}", code);

            // ✅ 메시지 구성
            Message message = new MimeMessage(session);
            message.setFrom(new InternetAddress(senderEmail));
            message.setRecipients(Message.RecipientType.TO, InternetAddress.parse(email));
            message.setSubject("캠핑플랫폼 회원 인증번호");
            message.setContent(emailBody, "text/html; charset=utf-8");

            // ✅ 전송
            Transport.send(message);
            return true;

        } catch (Exception e) {
            log.error("SMTP 이메일 전송 실패", e);
            return false;
        }
    }

    @Override
    public boolean verifyCode(String email, String inputCode) {
        String savedCode = verificationStore.get(email);
        return savedCode != null && savedCode.equals(inputCode);
    }
}
