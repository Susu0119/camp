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

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
@CrossOrigin(
        origins = "http://localhost:5173",  // 프론트 주소
        allowCredentials = "true"
)
public class KakaoAuthController {

    private final UserMapper userMapper;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @PostMapping(value = "/callback", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> body) {
        String code = body.get("code");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body("인가 코드 누락");
        }

        try {
            // 1. 액세스 토큰 요청
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

            ResponseEntity<String> tokenResponse = rt.postForEntity(
                    "https://kauth.kakao.com/oauth/token", tokenRequest, String.class
            );

            ObjectMapper om = new ObjectMapper();
            String accessToken = om.readTree(tokenResponse.getBody()).get("access_token").asText();

            // 2. 사용자 정보 요청
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            profileHeaders.add("Authorization", "Bearer " + accessToken);

            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);
            ResponseEntity<String> profileResponse = rt.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.POST, profileRequest, String.class
            );

            JsonNode userJson = om.readTree(profileResponse.getBody());
            String kakaoId = userJson.get("id").asText();
            String nickname = userJson.path("properties").path("nickname").asText();
            String email = userJson.path("kakao_account").path("email").asText(null);

            // 3. DB 처리
            UserDTO existing = userMapper.findByProvider(1, kakaoId);
            if (existing != null && existing.getPhone() != null && !existing.getPhone().isBlank()) {
                return ResponseEntity.ok("로그인 성공");
            } else {
                if (existing == null) {
                    UserDTO newUser = new UserDTO();
                    newUser.setProviderCode(1);
                    newUser.setProviderUserId(kakaoId);
                    newUser.setNickname(nickname);
                    newUser.setEmail(email);
                    newUser.setUserRole(1); // ⭐ 꼭 필요!
                    newUser.setPoint(0);
                    newUser.setChecklistAlert(true);
                    newUser.setReservationAlert(true);
                    newUser.setVacancyAlert(true);

                    userMapper.insertUser(newUser);
                }
                return ResponseEntity.status(HttpStatus.PARTIAL_CONTENT).body("전화번호 필요");
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("카카오 로그인 오류: " + e.getMessage());
        }
    }
}
