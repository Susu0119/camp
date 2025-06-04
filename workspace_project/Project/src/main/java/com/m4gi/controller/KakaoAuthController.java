package com.m4gi.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;

import lombok.RequiredArgsConstructor;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;
import javax.servlet.http.HttpSession;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
public class KakaoAuthController {

    private final UserMapper userMapper;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @PostMapping(value = "/callback", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> requestBody,
            HttpServletRequest request,
            HttpServletResponse httpServletResponse) {

        String code = requestBody.get("code");
        if (code == null || code.isBlank()) {
            return ResponseEntity.badRequest().body("인가 코드가 필요합니다.");
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

            HttpEntity<MultiValueMap<String, String>> tokenRequest = new HttpEntity<>(tokenParams, tokenHeaders);

            ResponseEntity<String> tokenResponse = rt.postForEntity(
                    "https://kauth.kakao.com/oauth/token", tokenRequest, String.class);

            ObjectMapper om = new ObjectMapper();
            JsonNode tokenJson = om.readTree(tokenResponse.getBody());
            String kakaoAccessToken = tokenJson.path("access_token").asText(null);
            if (kakaoAccessToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("액세스 토큰 획득에 실패했습니다.");
            }

            // 2. 사용자 정보 요청
            HttpHeaders profileHeaders = new HttpHeaders();
            profileHeaders.setContentType(MediaType.APPLICATION_FORM_URLENCODED);
            profileHeaders.add("Authorization", "Bearer " + kakaoAccessToken);

            HttpEntity<String> profileRequest = new HttpEntity<>(profileHeaders);
            ResponseEntity<String> profileResponse = rt.exchange(
                    "https://kapi.kakao.com/v2/user/me",
                    HttpMethod.POST, profileRequest, String.class);

            JsonNode userJson = om.readTree(profileResponse.getBody());
            String kakaoId = userJson.path("id").asText(null);
            String email = userJson.path("kakao_account").path("email").asText(null);

            if (kakaoId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("카카오 사용자 정보를 가져올 수 없습니다.");
            }

            // 3. 기존 사용자 확인
            UserDTO existingUser = userMapper.findByProvider(1, kakaoId);

            if (existingUser != null && existingUser.getPhone() != null && !existingUser.getPhone().isBlank()) {
                // 기존 사용자이고 전화번호가 있는 경우 - 로그인 성공
                HttpSession session = request.getSession(true);

                // 세션에 사용자 정보 저장
                session.setAttribute("loginUser", existingUser);
                session.setAttribute("providerCode", existingUser.getProviderCode());
                session.setAttribute("providerUserId", existingUser.getProviderUserId());
                session.setAttribute("userEmail", existingUser.getEmail());
                session.setAttribute("userNickname", existingUser.getNickname());
                session.setAttribute("kakaoAccessToken", kakaoAccessToken);

                // 세션 타임아웃 설정 (30분)
                session.setMaxInactiveInterval(30 * 60);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "로그인 성공");
                response.put("user", existingUser);
                response.put("sessionId", session.getId());

                return ResponseEntity.ok(response);
            } else {
                // 신규 사용자이거나 전화번호가 없는 경우
                if (existingUser == null) {
                    // 신규 사용자 생성
                    UserDTO newUser = new UserDTO();
                    newUser.setProviderCode(1);
                    newUser.setProviderUserId(kakaoId);
                    newUser.setEmail(email);
                    newUser.setNickname(getRandomNickname());
                    newUser.setPoint(0);
                    newUser.setChecklistAlert(true);
                    newUser.setReservationAlert(true);
                    newUser.setVacancyAlert(true);
                    newUser.setUserRole(1);
                    userMapper.insertUser(newUser);
                    existingUser = newUser;
                }

                // 임시 세션에 사용자 정보 저장 (전화번호 입력을 위해)
                HttpSession session = request.getSession(true);
                session.setAttribute("tempUser", existingUser);
                session.setAttribute("tempKakaoAccessToken", kakaoAccessToken);

                Map<String, Object> response = new HashMap<>();
                response.put("message", "전화번호 입력이 필요합니다");
                response.put("kakaoId", kakaoId);
                response.put("email", email);
                response.put("nickname", existingUser.getNickname());
                response.put("sessionId", session.getId());

                return ResponseEntity.status(HttpStatus.ACCEPTED).body(response);
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("카카오 로그인 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 로그인 상태 확인 API
    @PostMapping(value = "/status", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> checkLoginStatus(HttpServletRequest request) {
        Map<String, Object> response = new HashMap<>();

        HttpSession session = request.getSession(false);
        if (session == null) {
            response.put("isLoggedIn", false);
            response.put("message", "로그인되지 않음");
            return ResponseEntity.ok(response);
        }

        UserDTO user = (UserDTO) session.getAttribute("loginUser");
        if (user == null) {
            response.put("isLoggedIn", false);
            response.put("message", "로그인되지 않음");
            return ResponseEntity.ok(response);
        }

        response.put("isLoggedIn", true);
        response.put("message", "로그인 중");
        response.put("user", user);

        return ResponseEntity.ok(response);
    }

    // 전화번호 업데이트 API
    @PostMapping(value = "/update_phone", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> updatePhone(@RequestBody Map<String, String> requestBody, HttpServletRequest request) {
        String kakaoId = requestBody.get("kakaoId");
        String phone = requestBody.get("phone");

        if (kakaoId == null || phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("카카오 ID와 전화번호가 필요합니다.");
        }

        try {
            // 전화번호 형식 검증 및 포맷팅
            String formattedPhone = formatPhoneNumber(phone);
            if (formattedPhone == null) {
                return ResponseEntity.badRequest().body("올바른 전화번호 형식이 아닙니다.");
            }

            // 전화번호 업데이트
            userMapper.updatePhoneByKakaoId(formattedPhone, kakaoId);

            // 업데이트된 사용자 정보 다시 조회
            UserDTO updateUser = userMapper.findByProvider(1, kakaoId);
            if (updateUser == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }

            // 세션에 완전한 사용자 정보 저장
            HttpSession session = request.getSession(false);
            String kakaoAccessToken = (String) session.getAttribute("tempKakaoAccessToken");

            session.setAttribute("loginUser", updateUser);
            session.setAttribute("providerCode", updateUser.getProviderCode());
            session.setAttribute("providerUserId", updateUser.getProviderUserId());
            session.setAttribute("userEmail", updateUser.getEmail());
            session.setAttribute("userNickname", updateUser.getNickname());
            session.setAttribute("kakaoAccessToken", kakaoAccessToken);

            // 세션 타임아웃 설정 (30분)
            session.setMaxInactiveInterval(30 * 60);

            // 임시 데이터 정리
            session.removeAttribute("tempUser");
            session.removeAttribute("tempKakaoAccessToken");

            Map<String, Object> response = new HashMap<>();
            response.put("message", "전화번호 업데이트 및 로그인 완료");
            response.put("user", updateUser);

            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("전화번호 업데이트 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 인증번호 전송 API
    @PostMapping(value = "/send_verification", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> requestBody) {
        String phone = requestBody.get("phone");

        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("전화번호가 필요합니다.");
        }

        try {
            String formattedPhone = formatPhoneNumber(phone);
            if (formattedPhone == null) {
                return ResponseEntity.badRequest().body("올바른 전화번호 형식이 아닙니다.");
            }

            // 인증번호 생성 및 저장 (실제 SMS 발송은 구현되지 않음)
            String verificationCode = generateVerificationCode();
            verificationCodes.put(formattedPhone, verificationCode);

            System.out.println("인증번호 발송: " + formattedPhone + " -> " + verificationCode);

            return ResponseEntity.ok("인증번호가 발송되었습니다. (개발 환경에서는 콘솔을 확인하세요)");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("인증번호 발송 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 전화번호 인증 API
    @PostMapping(value = "/verify_phone", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> verifyPhoneNumber(@RequestBody Map<String, String> requestBody) {
        String phone = requestBody.get("phone");
        String code = requestBody.get("code");

        if (phone == null || code == null || phone.isBlank() || code.isBlank()) {
            return ResponseEntity.badRequest().body("전화번호와 인증번호가 필요합니다.");
        }

        try {
            String formattedPhone = formatPhoneNumber(phone);
            if (formattedPhone == null) {
                return ResponseEntity.badRequest().body("올바른 전화번호 형식이 아닙니다.");
            }

            String storedCode = verificationCodes.get(formattedPhone);
            if (storedCode == null) {
                return ResponseEntity.badRequest().body("인증번호가 발송되지 않았거나 만료되었습니다.");
            }

            if (!storedCode.equals(code)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("인증번호가 일치하지 않습니다.");
            }

            // 인증 성공 시 코드 제거
            verificationCodes.remove(formattedPhone);

            return ResponseEntity.ok("전화번호 인증이 완료되었습니다.");

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("전화번호 인증 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 랜덤 닉네임 생성
    private String getRandomNickname() {
        String[] adjectives = {
                "행복한", "즐거운", "신나는", "멋진", "귀여운", "똑똑한", "빠른", "강한",
                "재밌는", "용감한", "친절한", "예쁜", "화려한", "활발한", "조용한", "차분한"
        };

        String[] nouns = {
                "캠퍼", "여행자", "모험가", "탐험가", "등반가", "하이커", "백패커", "캠핑족",
                "아웃도어", "자연인", "산악인", "낚시꾼", "사진가", "별보기", "힐링족", "휴양객"
        };

        Random random = new Random();
        String adjective = adjectives[random.nextInt(adjectives.length)];
        String noun = nouns[random.nextInt(nouns.length)];
        int number = random.nextInt(1000) + 1;

        return adjective + noun + number;
    }

    // 전화번호 형식 검증 및 포맷팅
    private String formatPhoneNumber(String phone) {
        if (phone == null)
            return null;

        // 숫자만 추출
        String digitsOnly = phone.replaceAll("[^0-9]", "");

        // 한국 휴대폰 번호 형식 검증 (010으로 시작하는 11자리)
        if (digitsOnly.length() == 11 && digitsOnly.startsWith("010")) {
            return digitsOnly.substring(0, 3) + "-" +
                    digitsOnly.substring(3, 7) + "-" +
                    digitsOnly.substring(7);
        }

        return null; // 형식이 맞지 않으면 null 반환
    }

    // 인증번호 저장용 임시 맵 (실제 운영에서는 Redis 등 사용 권장)
    private Map<String, String> verificationCodes = new ConcurrentHashMap<>();

    // 6자리 인증번호 생성
    private String generateVerificationCode() {
        return String.format("%06d", new Random().nextInt(1000000));
    }

    // 로그아웃 API
    @PostMapping(value = "/logout", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogout(HttpServletRequest request, HttpServletResponse httpServletResponse) {
        try {
            HttpSession session = request.getSession(false);

            if (session != null) {
                // 카카오 로그아웃 시도
                String kakaoAccessToken = (String) session.getAttribute("kakaoAccessToken");
                if (kakaoAccessToken != null && !kakaoAccessToken.isBlank()) {
                    try {
                        // 카카오 로그아웃 API 호출
                        RestTemplate rt = new RestTemplate();
                        HttpHeaders headers = new HttpHeaders();
                        headers.add("Authorization", "Bearer " + kakaoAccessToken);

                        HttpEntity<String> entity = new HttpEntity<>(headers);
                        rt.postForEntity("https://kapi.kakao.com/v1/user/logout", entity, String.class);

                        System.out.println("카카오 로그아웃 성공");
                    } catch (Exception e) {
                        System.err.println("카카오 로그아웃 실패: " + e.getMessage());
                        // 카카오 로그아웃 실패해도 로컬 세션은 무효화
                    }
                }

                // 세션 무효화
                session.invalidate();
            }

            // 세션 쿠키 명시적 제거
            javax.servlet.http.Cookie sessionCookie = new javax.servlet.http.Cookie("JSESSIONID", null);
            sessionCookie.setMaxAge(0);
            sessionCookie.setPath("/web");
            sessionCookie.setHttpOnly(true);
            httpServletResponse.addCookie(sessionCookie);

            Map<String, Object> response = new HashMap<>();
            response.put("message", "로그아웃");
            return ResponseEntity.ok(response);

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("로그아웃 처리 중 오류가 발생했습니다: " + e.getMessage());
        }
    }

    // 세션 상태 확인 API (디버깅용)
    @GetMapping("/session-info")
    public ResponseEntity<?> getSessionInfo(HttpServletRequest request) {
        HttpSession session = request.getSession(false);
        Map<String, Object> response = new HashMap<>();

        if (session == null) {
            response.put("hasSession", false);
            response.put("message", "세션이 없습니다");
        } else {
            response.put("hasSession", true);
            response.put("sessionId", session.getId());
            response.put("loginUser", session.getAttribute("loginUser"));
            response.put("isLoggedIn", session.getAttribute("loginUser") != null);
            response.put("creationTime", session.getCreationTime());
            response.put("lastAccessedTime", session.getLastAccessedTime());
            response.put("maxInactiveInterval", session.getMaxInactiveInterval());
        }

        return ResponseEntity.ok(response);
    }
}