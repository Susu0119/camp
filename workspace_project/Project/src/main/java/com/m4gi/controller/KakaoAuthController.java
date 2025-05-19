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

@CrossOrigin(origins = "http://localhost:5173")
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

        try {
            // 1️ 토큰 요청
            RestTemplate rt = new RestTemplate();
            HttpHeaders tokenHeaders = new HttpHeaders();
            tokenHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);

            MultiValueMap<String, String> tokenParams = new LinkedMultiValueMap<>();
            tokenParams.add("grant_type", "authorization_code");
            tokenParams.add("client_id","bf9ca2519e756351ed74d97f6373e33d");
            tokenParams.add("redirect_uri", "http://localhost:5173/oauth/kakao/callback");
            tokenParams.add("code", code);

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenParams, tokenHeaders);
            ResponseEntity<String> tokenResponse = rt.postForEntity(
                    "https://kauth.kakao.com/oauth/token", tokenRequest, String.class);

            ObjectMapper objectMapper = new ObjectMapper();
            JsonNode tokenJson = objectMapper.readTree(tokenResponse.getBody());
            String accessToken = tokenJson.get("access_token").asText();

            // 2️ 사용자 정보 요청
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            profileHeaders.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);
            ResponseEntity<String> profileResponse = rt.exchange(
                    "https://kapi.kakao.com/v2/user/me", HttpMethod.POST, profileRequest, String.class);

            JsonNode userJson = objectMapper.readTree(profileResponse.getBody());
            String kakaoId = userJson.get("id").asText();

            String nickname = userJson.path("properties").path("nickname").asText(null);
            String email = userJson.path("kakao_account").path("email").asText(null);

            // 3️ DB 조회
            UserDTO existingUser = userMapper.findByKakaoId(kakaoId);

            if (existingUser != null) {
                // 유저가 있고 전화번호도 있으면 로그인 성공
                if (existingUser.getPhone() != null && !existingUser.getPhone().isBlank()) {
                    return ResponseEntity.ok(Map.of(
                        "status", "success",
                        "message", "로그인 완료",
                        "user", existingUser
                    ));
                } else {
                    // 유저는 있지만 전화번호 없음
                    return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(Map.of(
                        "status", "need_phone",
                        "message", "전화번호 입력 필요",
                        "userId", existingUser.getKakaoId()
                    ));
                }
            } else {
                // 유저 없음 → 신규 등록
                UserDTO newUser = new UserDTO();
                newUser.setKakaoId(kakaoId);
                newUser.setUsername("kakao_" + kakaoId.substring(0, 8));
                newUser.setNickname(nickname);
                newUser.setEmail(email);
                userMapper.insertUser(newUser);

                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body(Map.of(
                    "status", "need_phone",
                    "message", "신규 가입 - 전화번호 입력 필요",
                    "userId", newUser.getKakaoId()
                ));
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(Map.of(
                "status", "error",
                "message", "카카오 로그인 처리 중 오류",
                "detail", e.getMessage()
            ));
        }
    }
}
