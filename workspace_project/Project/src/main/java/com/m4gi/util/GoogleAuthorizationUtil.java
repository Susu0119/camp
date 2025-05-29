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
import com.google.cloud.storage.Blob;
import com.google.cloud.storage.BlobId;
import com.google.cloud.storage.Storage;
import com.google.cloud.storage.StorageOptions;

import java.io.File;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.io.IOException;
import java.nio.channels.Channels;
import java.util.Collections;
import java.util.List;

public class GoogleAuthorizationUtil {
    private static final String PROJECT_ID        = "latale-1d43a";
    private static final String BUCKET_NAME       = "m4gi";
    private static final String CLIENT_JSON_OBJECT = "client.json";
    // Gmail scope
    private static final List<String> SCOPES =
            Collections.singletonList("https://www.googleapis.com/auth/gmail.send");
    private static final JsonFactory JSON_FACTORY = GsonFactory.getDefaultInstance();
    private static final String TOKENS_DIR = "tokens";



    public static Credential getCredential(NetHttpTransport HTTP_TRANSPORT) throws IOException {
        // 1) GCS 클라이언트 생성
        Storage storage = StorageOptions.newBuilder()
                .setProjectId(PROJECT_ID)
                .build()
                .getService();

        // 2) client.json Blob 가져오기
        Blob blob = storage.get(BlobId.of(BUCKET_NAME, CLIENT_JSON_OBJECT));
        if (blob == null) {
            throw new IOException("GCS에 client.json이 없습니다: gs://"
                    + BUCKET_NAME + "/" + CLIENT_JSON_OBJECT);
        }

        // 3) InputStreamReader로 파싱
        try (InputStream in = Channels.newInputStream(blob.reader());
             InputStreamReader reader = new InputStreamReader(in)) {
            GoogleClientSecrets clientSecrets =
                    GoogleClientSecrets.load(JSON_FACTORY, reader);

            // 4) 인증 흐름 구축
            GoogleAuthorizationCodeFlow flow = new GoogleAuthorizationCodeFlow.Builder(
                    HTTP_TRANSPORT, JSON_FACTORY, clientSecrets, SCOPES)
                    .setDataStoreFactory(new FileDataStoreFactory(new java.io.File(TOKENS_DIR)))
                    .setAccessType("offline")
                    //.setApprovalPrompt("force")
                    .build();

            LocalServerReceiver receiver = new LocalServerReceiver.Builder()
                    .setPort(8888)
                    .build();

            return new AuthorizationCodeInstalledApp(flow, receiver)
                    .authorize("user");
        }
    }
}
