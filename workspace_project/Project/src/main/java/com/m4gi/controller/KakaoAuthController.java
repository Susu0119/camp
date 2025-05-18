package com.m4gi.controller;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
public class KakaoAuthController {

    // 나중에 DB 연결 시 다시 활성화
    // private final UserMapper userMapper;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @PostMapping("/callback")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body) {
        String code = body.get("code");

        System.out.println(" code = " + code);

        try {
            // 1. access_token 요청
            RestTemplate rt = new RestTemplate();
            HttpHeaders tokenHeaders = new HttpHeaders();
            tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> tokenParams = new LinkedMultiValueMap<>();
            tokenParams.add("grant_type", "authorization_code");
            tokenParams.add("client_id", kakaoRestApiKey);
            tokenParams.add("redirect_uri", "http://localhost:5173/oauth/kakao/callback");
            tokenParams.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenParams, tokenHeaders);
            ResponseEntity<String> tokenResponse = rt.postForEntity(
                    "https://kauth.kakao.com/oauth/token", tokenRequest, String.class);

            System.out.println("🔐 Token Response: " + tokenResponse.getBody());

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode tokenJson = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = tokenJson.get("access_token").asText();

            // 2. 사용자 정보 요청
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            profileHeaders.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);
            ResponseEntity<String> profileResponse = rt.exchange(
                    "https://kapi.kakao.com/v2/user/me", HttpMethod.POST, profileRequest, String.class
            );

            System.out.println("👤 Profile Response: " + profileResponse.getBody());

            JsonNode userJson = objectMapper.readTree(profileResponse.getBody());
            String kakaoId = userJson.get("id").asText();
            String nickname = userJson.path("properties").path("nickname").asText();
            String email = userJson.path("kakao_account").path("email").asText(null);

            // DB 없이 테스트 모드 (무조건 전화번호 입력 페이지로 유도)
            System.out.println(" DB 없이 테스트 중 → 전화번호 입력 화면으로 이동");
            return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body("전화번호 입력 필요");

            // 나중에 DB 붙일 때 아래 코드 활성화
            /*
            UserDTO existingUser = userMapper.findByKakaoId(kakaoId);
            if (existingUser != null && existingUser.getPhone() != null && !existingUser.getPhone().isBlank()) {
                return ResponseEntity.ok("로그인 성공");
            } else {
                if (existingUser == null) {
                    UserDTO newUser = new UserDTO();
                    newUser.setKakaoId(kakaoId);
                    newUser.setUsername("kakao_" + kakaoId.substring(0, 8));
                    newUser.setNickname(nickname);
                    newUser.setEmail(email);
                    userMapper.insertUser(newUser);
                }
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body("전화번호 필요");
            }
            */

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("카카오 로그인 처리 중 오류 발생: " + e.getMessage());
        }
    }
}
