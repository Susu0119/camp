package com.m4gi.util;

import com.google.api.client.googleapis.auth.oauth2.GoogleAuthorizationCodeFlow;
import com.google.api.client.googleapis.auth.oauth2.GoogleClientSecrets;
import com.google.api.client.extensions.java6.auth.oauth2.AuthorizationCodeInstalledApp;
import com.google.api.client.extensions.jetty.auth.oauth2.LocalServerReceiver;
import com.google.api.client.json.JsonFactory;
import com.google.api.client.json.gson.GsonFactory;
import com.google.api.client.util.store.FileDataStoreFactory;
import com.google.api.client.auth.oauth2.Credential;
import com.google.api.client.http.javanet.NetHttpTransport;

import java.io.InputStreamReader;
import java.io.InputStream;
import java.io.File;
import java.util.Collections;
import java.util.List;

public class GoogleAuthorizationUtil {

    private static final List<String> SCOPES = Collections.singletonList("https://www.googleapis.com/auth/gmail.send");
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIR = "tokens";

    public static Credential getCredential(NetHttpTransport HTTP_TRANSPORT) throws Exception {

        // ✅ resources/client.json 불러오기
        InputStream in = GoogleAuthorizationUtil.class.getClassLoader().getResourceAsStream("client.json");
        if (in == null) {
            throw new IllegalArgumentException("client.json not found in resources/");
        }

        GoogleClientSecrets clientSecrets = GoogleClientSecrets.load(JSON_FACTORY, new InputStreamReader(in));

        // ✅ 인증 흐름 생성
        GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                .setDataStoreFactory(new FileDataStoreFactory(new File(TOKENS_DIR)))
                .setAccessType("offline")
                .build();

        // ✅ 인증 콜백 포트 8889
        LocalServerReceiver receiver = new LocalServerReceiver.Builder()
                .setPort(8889)
                .build();

        return new AuthorizationCodeInstalledApp(flow, receiver).authorize("user");
    }
}
