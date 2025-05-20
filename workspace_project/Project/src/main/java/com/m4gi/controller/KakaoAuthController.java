package com.m4gi.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

/*@CrossOrigin(
	    origins = "http://localhost:5173",
	    allowCredentials = "true",
	    allowedHeaders = "*",
	    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.OPTIONS}   // ★ 추가
	)*/
@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
public class KakaoAuthController {

    private final UserMapper userMapper;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @PostMapping("/callback")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        System.out.println("### 인가 코드 = " + code);   // ← ① 첫 값 확인

        try {
            // 1) access_token 요청 --------------------------------------
            RestTemplate rt = new RestTemplate();
            HttpHeaders tokenHeaders = new HttpHeaders();
            tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> tokenParams = new LinkedMultiValueMap<>();
            tokenParams.add("grant_type", "authorization_code");
            tokenParams.add("client_id", kakaoRestApiKey);
            tokenParams.add("redirect_uri", "http://localhost:5173/oauth/kakao/callback");
            tokenParams.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest =
                    new HttpEntity<>(tokenParams, tokenHeaders);

            ResponseEntity<String> tokenResponse =
                    rt.postForEntity("https://kauth.kakao.com/oauth/token",
                                     tokenRequest, String.class);

            System.out.println("### 토큰 응답 = " + tokenResponse.getBody()); // ← ② 토큰 JSON

            ObjectMapper om = new ObjectMapper();
            JsonNode tokenJson = om.readTree(tokenResponse.getBody());
            String accessToken = tokenJson.get("access_token").asText();
            System.out.println("### accessToken = " + accessToken);        // ← ③ 액세스 토큰

            // 2) 사용자 정보 요청 ----------------------------------------
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            profileHeaders.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);

            ResponseEntity<String> profileResponse =
                    rt.exchange("https://kapi.kakao.com/v2/user/me",
                                HttpMethod.POST, profileRequest, String.class);

            System.out.println("### 프로필 응답 = " + profileResponse.getBody()); // ← ④ 프로필 JSON

            JsonNode userJson = om.readTree(profileResponse.getBody());
            String kakaoId  = userJson.get("id").asText();
            String nickname = userJson.path("properties").path("nickname").asText();
            String email    = userJson.path("kakao_account").path("email").asText(null);

            // 3) DB 처리 -----------------------------------------------
            UserDTO existing = userMapper.findByProvider(1, kakaoId);

            if (existing != null && existing.getPhone() != null && !existing.getPhone().isBlank()) {
                System.out.println("### 기존 사용자, 전화번호 존재 → 로그인 완료");
                return ResponseEntity.ok("로그인 성공");
            } else {
                if (existing == null) {
                    UserDTO newUser = new UserDTO();
                    newUser.setProviderCode(1);
                    newUser.setProviderUserId(kakaoId);
                    newUser.setNickname(nickname);
                    newUser.setEmail(email);
                    userMapper.insertUser(newUser);
                    System.out.println("### 신규 사용자 DB 저장 완료");
                }
                System.out.println("### 전화번호 입력 필요");
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body("전화번호 필요");
            }

        } catch (Exception e) {
            System.out.println("### 예외 발생 ------------------------------");
            e.printStackTrace();                       // ← 전체 스택 콘솔 출력
            System.out.println("### --------------------------------------");
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                                 .body("카카오 로그인 오류: " + e.getMessage());
        }
    }
}
