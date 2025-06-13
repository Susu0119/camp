package com.m4gi.service;

import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

@Service
public class PortOneServiceImpl implements PortOneService {



    private final String IMP_KEY = "포트원 키";
    private final String IMP_SECRET = "포트원 시크릿";

    private final RestTemplate restTemplate = new RestTemplate();

    @Override
    public String getAccessToken() {
        String url = "https://api.iamport.kr/users/getToken";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        JSONObject body = new JSONObject();
        body.put("imp_key", IMP_KEY);
        body.put("imp_secret", IMP_SECRET);

        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        JSONObject json = new JSONObject(response.getBody());
        return json.getJSONObject("response").getString("access_token");
    }

    @Override
    public void cancelPayment(String impUid, int amount, String reason, String accessToken) {
        String url = "https://api.iamport.kr/payments/cancel";

        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);
        headers.set("Authorization", "Bearer " + accessToken); // ✅ 여기만 수정

        JSONObject body = new JSONObject();
        body.put("imp_uid", impUid);
        body.put("amount", amount);
        body.put("reason", reason);

        HttpEntity<String> request = new HttpEntity<>(body.toString(), headers);
        ResponseEntity<String> response = restTemplate.postForEntity(url, request, String.class);

        if (!response.getStatusCode().is2xxSuccessful()) {
            throw new RuntimeException("환불 실패: " + response.getBody());
        }
    }

}
