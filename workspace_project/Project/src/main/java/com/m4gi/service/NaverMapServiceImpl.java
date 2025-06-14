package com.m4gi.service;

import org.springframework.stereotype.Service;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URI;
import java.net.URL;

@Service
public class NaverMapServiceImpl implements NaverMapService {

    private static final String NAVER_API_URL = "https://maps.apigw.ntruss.com/map-direction/v1/driving";
    private static final String CLIENT_ID = "lu8j6f2gm2";
    private static final String CLIENT_SECRET = "OEHWyFZUJ4nHGdKRM8oMMOR8ixbeoFKfbPUAqBfO";

    @Override
    public String getDirections(String start, String goal) throws Exception {
        String urlStr = NAVER_API_URL + "?start=" + start + "&goal=" + goal;
        URI uri = new URI(urlStr);
        URL url = uri.toURL();
        HttpURLConnection conn = (HttpURLConnection) url.openConnection();

        try {
            // 요청 설정
            conn.setRequestMethod("GET");
            conn.setRequestProperty("X-NCP-APIGW-API-KEY-ID", CLIENT_ID);
            conn.setRequestProperty("X-NCP-APIGW-API-KEY", CLIENT_SECRET);
            conn.setRequestProperty("Content-Type", "application/json");

            // 응답 읽기
            int responseCode = conn.getResponseCode();
            InputStream inputStream = (responseCode == 200) ? conn.getInputStream() : conn.getErrorStream();

            BufferedReader reader = new BufferedReader(new InputStreamReader(inputStream, "UTF-8"));
            StringBuilder response = new StringBuilder();
            String line;

            while ((line = reader.readLine()) != null) {
                response.append(line);
            }
            reader.close();

            return response.toString();

        } finally {
            conn.disconnect();
        }
    }
}