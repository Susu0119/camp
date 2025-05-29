    package com.m4gi.service;

    import com.google.api.client.auth.oauth2.Credential;
    import com.google.api.client.googleapis.javanet.GoogleNetHttpTransport;
    import com.google.api.client.json.gson.GsonFactory;
    import com.google.api.services.gmail.Gmail;
    import com.google.api.services.gmail.model.Message;
    import org.apache.commons.codec.binary.Base64;

    import javax.mail.MessagingException;
    import javax.mail.Session;
    import javax.mail.internet.InternetAddress;
    import javax.mail.internet.MimeMessage;
    import java.io.ByteArrayOutputStream;
    import java.io.IOException;
    import java.io.UnsupportedEncodingException;
    import java.security.GeneralSecurityException;
    import java.util.Properties;

    public class GmailService {

        // Gmail API 인증 후 생성된 Credential 객체를 전달받아 서비스 객체를 생성합니다.
        public static Gmail getGmailService(Credential credential) throws GeneralSecurityException, IOException {
            return new Gmail.Builder(GoogleNetHttpTransport.newTrustedTransport(),
                    GsonFactory.getDefaultInstance(),
                    credential)
                    .setApplicationName("Sellity")
                    .build();
        }

        // MimeMessage 생성 (수신자, 발신자, 제목, 본문)
        public static MimeMessage createEmail(String to, String from, String fromName, String subject, String bodyText)
                throws MessagingException, UnsupportedEncodingException {
            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);
            MimeMessage email = new MimeMessage(session);
            email.setFrom(new InternetAddress(from, fromName));
            email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(to));
            email.setSubject(subject);
            email.setText(bodyText);
            return email;
        }

        // MimeMessage를 Gmail API Message 객체로 변환
        public static Message createMessageWithEmail(MimeMessage emailContent)
                throws MessagingException, IOException {
            ByteArrayOutputStream buffer = new ByteArrayOutputStream();
            emailContent.writeTo(buffer);
            byte[] bytes = buffer.toByteArray();
            String encodedEmail = Base64.encodeBase64URLSafeString(bytes);
            Message message = new Message();
            message.setRaw(encodedEmail);
            return message;
        }

        public static MimeMessage createEmailWithHtml(String to, String from, String fromName, String subject, String htmlContent)
                throws MessagingException, UnsupportedEncodingException {
            Properties props = new Properties();
            Session session = Session.getDefaultInstance(props, null);
            MimeMessage email = new MimeMessage(session);
            email.setFrom(new InternetAddress(from, fromName));
            email.addRecipient(javax.mail.Message.RecipientType.TO, new InternetAddress(to));
            email.setSubject(subject, "UTF-8");
            email.setContent(htmlContent, "text/html; charset=UTF-8");
            return email;
        }

        // Gmail API를 사용하여 이메일 전송
        public static Message sendMessage(Gmail service, String userId, MimeMessage emailContent)
                throws MessagingException, IOException {
            Message message = createMessageWithEmail(emailContent);
            message = service.users().messages().send(userId, message).execute();
            //System.out.println("Message id: " + message.getId());
            //System.out.println(message.toPrettyString());
            return message;
        }
    }
