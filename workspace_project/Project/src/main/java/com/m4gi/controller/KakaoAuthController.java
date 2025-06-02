package com.m4gi.controller;

import java.util.HashMap;
import java.util.Map;
import java.util.Random;
import java.util.concurrent.ConcurrentHashMap;

import com.m4gi.service.RefreshTokenStoreService;
import io.jsonwebtoken.ExpiredJwtException;
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
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;
import com.m4gi.service.TokenBlacklistService;
import com.m4gi.util.JWTUtil;

import lombok.RequiredArgsConstructor;

import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import java.util.Date;
import java.net.URL;
import java.io.BufferedReader;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
@CrossOrigin(
        origins = "http://localhost:5173",  // 프론트 주소
        allowCredentials = "true"
)
public class KakaoAuthController {
	
    private final UserMapper userMapper;
    private final JWTUtil jwtUtil;
    private final TokenBlacklistService tokenBlacklistService;
    private final RefreshTokenStoreService refreshTokenService;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    private final String REFRESH_TOKEN_COOKIE_NAME = "Campia_Refresh";

    @PostMapping(value = "/callback", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> requestBody, HttpServletResponse httpServletResponse) {

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

            HttpEntity<MultiValueMap<String, String>> tokenRequest =
                    new HttpEntity<>(tokenParams, tokenHeaders);

            ResponseEntity<String> tokenResponse = rt.postForEntity(
                    "https://kauth.kakao.com/oauth/token", tokenRequest, String.class
            );

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
                    HttpMethod.POST, profileRequest, String.class
            );

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
                String campiaAccessToken = jwtUtil.generateAccessToken(kakaoId, existingUser.getEmail(), existingUser.getNickname(), kakaoAccessToken);
                String campiaRefreshToken = jwtUtil.generateRefreshToken(kakaoId);

                refreshTokenService.saveToken(kakaoId, campiaRefreshToken);

                // 리프레시 토큰을 HttpOnly 쿠키로 설정
                Cookie refreshTokenCookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, campiaRefreshToken);
                refreshTokenCookie.setHttpOnly(true);
                refreshTokenCookie.setSecure(false); // TODO: HTTPS 운영 환경에서는 true로 변경
                refreshTokenCookie.setPath("/"); // 애플리케이션 전체 경로에서 사용
                refreshTokenCookie.setMaxAge((int) (jwtUtil.getRefreshTokenExpirationMillis() / 1000)); // JWTUtil에서 리프레시 토큰 만료 시간(ms)을 가져와 초 단위로 설정
                httpServletResponse.addCookie(refreshTokenCookie);

                // 리프레시 토큰 서버에 저장
                refreshTokenService.saveToken(kakaoId, campiaRefreshToken);
                Map<String, Object> response = new HashMap<>();
                response.put("message", "로그인 성공");
                response.put("token", campiaAccessToken);
                response.put("user", existingUser);
                
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
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "전화번호 입력이 필요합니다");
                response.put("kakaoId", kakaoId);
                response.put("email", email);
                response.put("nickname", existingUser.getNickname());
                
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
    public ResponseEntity<?> checkLoginStatus(@RequestHeader(value = "Authorization", required = false) String authHeader) {
        Map<String, Object> response = new HashMap<>();
        
        if (authHeader == null || !authHeader.startsWith("Bearer ")) {
            response.put("isLoggedIn", false);
            response.put("message", "토큰이 없습니다");
            return ResponseEntity.ok(response);
        }
        
        String token = authHeader.substring(7); // "Bearer " 제거
        
        if (!jwtUtil.validateToken(token) || jwtUtil.isTokenExpired(token)) {
            response.put("isLoggedIn", false);
            response.put("message", "유효하지 않거나 만료된 토큰입니다");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        // 블랙리스트 확인 추가
        if (tokenBlacklistService.isBlacklisted(token)) {
            response.put("isLoggedIn", false);
            response.put("message", "로그아웃 상태입니다.");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
        
        try {
            String kakaoId = jwtUtil.getKakaoIdFromToken(token);
            
            // DB에서 최신 사용자 정보 조회
            UserDTO user = userMapper.findByProvider(1, kakaoId);
            
            if (user != null) {
                response.put("isLoggedIn", true);
                response.put("user", user);
                response.put("message", "로그인 상태입니다");
            } else {
                response.put("isLoggedIn", false);
                response.put("message", "사용자 정보를 찾을 수 없습니다");
            }
            
            return ResponseEntity.ok(response);
            
        } catch (Exception e) {
            response.put("isLoggedIn", false);
            response.put("message", "토큰 처리 중 오류가 발생했습니다");
            return ResponseEntity.ok(response);
        }
    }

    @PostMapping(value = "/update_phone", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> updatePhone(@RequestBody Map<String, String> requestBody) {
        
        String kakaoId = requestBody.get("kakaoId");
        String phone = requestBody.get("phone");
        
        if (kakaoId == null || kakaoId.isBlank()) {
            return ResponseEntity.badRequest().body("카카오 ID가 필요합니다.");
        }
        
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("전화번호가 필요합니다.");
        }
        
        // 전화번호 형식 간단 검증 (하이픈 있거나 없거나)
        if (!phone.matches("^01[0-9][-]?[0-9]{4}[-]?[0-9]{4}$")) {
            return ResponseEntity.badRequest().body("올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678)");
        }
        
        // 전화번호를 표준 형식(010-XXXX-XXXX)으로 변환
        String formattedPhone = formatPhoneNumber(phone);
        try {
            // 사용자 존재 여부 확인
            UserDTO existing = userMapper.findByProvider(1, kakaoId);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }
            
            // 전화번호 중복 확인
            UserDTO phoneUser = userMapper.findByPhone(formattedPhone);
            if (phoneUser != null && !phoneUser.getProviderUserId().equals(kakaoId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 전화번호입니다.");
            }
            
            // 전화번호 업데이트
            userMapper.updatePhoneByKakaoId(formattedPhone, kakaoId);
            return ResponseEntity.ok("전화번호가 성공적으로 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("전화번호 등록 중 오류가 발생했습니다.");
        }
    }

    // 전화번호 인증번호 발송
    @PostMapping(value = "/send_verification", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> sendVerificationCode(@RequestBody Map<String, String> requestBody) {
        String phone = requestBody.get("phone");
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("전화번호가 필요합니다.");
        }
        
        // 전화번호 형식 검증
        if (!phone.matches("^01[0-9][-]?[0-9]{4}[-]?[0-9]{4}$")) {
            return ResponseEntity.badRequest().body("올바른 전화번호 형식이 아닙니다.");
        }
        
        // 전화번호 포맷팅
        String formattedPhone = formatPhoneNumber(phone);
        try {
            // 6자리 인증번호 생성
            String verificationCode = generateVerificationCode();
            
            // Redis나 메모리에 인증번호 저장 (5분 만료)
            // 현재는 간단히 로그로 출력 (실제로는 SMS 발송)
            System.out.println("=== 인증번호 발송 ===");
            System.out.println("전화번호: " + formattedPhone);
            System.out.println("인증번호: " + verificationCode);
            System.out.println("==================");
            // TODO: 실제 SMS 발송 로직 구현
            // smsService.sendVerificationCode(formattedPhone, verificationCode);
            // 임시로 세션이나 캐시에 저장 (실제로는 Redis 사용 권장)
            verificationCodes.put(formattedPhone, verificationCode);
            return ResponseEntity.ok("인증번호가 발송되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("인증번호 발송 중 오류가 발생했습니다.");
        }
    }
    
    // 전화번호 인증번호 확인
    @PostMapping(value = "/verify_phone", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> verifyPhoneNumber(@RequestBody Map<String, String> requestBody) {
        String kakaoId = requestBody.get("kakaoId");
        String phone = requestBody.get("phone");
        String verificationCode = requestBody.get("verificationCode");
        
        if (kakaoId == null || kakaoId.isBlank()) {
            return ResponseEntity.badRequest().body("카카오 ID가 필요합니다.");
        }
        if (phone == null || phone.isBlank()) {
            return ResponseEntity.badRequest().body("전화번호가 필요합니다.");
        }
        if (verificationCode == null || verificationCode.isBlank()) {
            return ResponseEntity.badRequest().body("인증번호가 필요합니다.");
        }
        
        // 전화번호 포맷팅
        String formattedPhone = formatPhoneNumber(phone);
        try {
            // 인증번호 확인
            String storedCode = verificationCodes.get(formattedPhone);
            if (storedCode == null) {
                return ResponseEntity.badRequest().body("인증번호가 만료되었거나 존재하지 않습니다.");
            }
            if (!storedCode.equals(verificationCode)) {
                return ResponseEntity.badRequest().body("인증번호가 일치하지 않습니다.");
            }
            // 사용자 존재 여부 확인
            UserDTO existing = userMapper.findByProvider(1, kakaoId);
            if (existing == null) {
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body("사용자를 찾을 수 없습니다.");
            }
            // 전화번호 중복 확인
            UserDTO phoneUser = userMapper.findByPhone(formattedPhone);
            if (phoneUser != null && !phoneUser.getProviderUserId().equals(kakaoId)) {
                return ResponseEntity.status(HttpStatus.CONFLICT).body("이미 사용 중인 전화번호입니다.");
            }
            
            // 전화번호 업데이트
            userMapper.updatePhoneByKakaoId(formattedPhone, kakaoId);
            
            // 인증번호 삭제
            verificationCodes.remove(formattedPhone);
            return ResponseEntity.ok("전화번호가 성공적으로 인증되고 등록되었습니다.");
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("전화번호 인증 중 오류가 발생했습니다.");
        }
    }

    // 랜덤 닉네임 생성 메서드
    private String getRandomNickname() {
        String[] adjectives = {
            "캠핑", "여행", "자연", "별빛", "모닥불", "텐트", "숲속", "바람",
            "산속", "호수", "계곡",  "달빛", "힐링", "휴식", "여유", "낭만",
            "청정", "신선한", "평화", "고요", "깨끗한", "맑은", "시원한",
            "모험", "야생의", "원시", "순수한", "따뜻한", "포근한", "아늑한",
            "편안한", "광활한", "무한의", "황금빛", "은빛", "투명한", "깊은", "높은"
        };
        
        String[] nouns = {
            "러버", "마니아", "탐험가", "모험가", "여행자", "캠퍼", "힐러", "드리머",
            "워커", "하이커", "클라이머", "라이더", "서퍼", "피셔", "헌터", "가이드",
            "마스터", "전문가", "애호가", "수집가", "연구가", "관찰자", "기록자", "추적자",
            "개척자", "정착자", "발견자", "창조자", "건설자", "설계자", "기획자", "동반자",  
            "왕자", "공주", "기사", "마법사", "요정", "엘프", "드루이드", "파트너"
        };
        
        Random random = new Random();
        String baseNickname = adjectives[random.nextInt(adjectives.length)] + 
                             nouns[random.nextInt(nouns.length)];
        int randomNumber = 1000 + random.nextInt(9000);
        return baseNickname + randomNumber;
    }

    // 전화번호 포맷팅 메서드 (01012345678 -> 010-1234-5678)
    private String formatPhoneNumber(String phone) {
        // 하이픈 제거
        String cleanPhone = phone.replaceAll("-", "");
        // 010-XXXX-XXXX 형식으로 변환
        if (cleanPhone.length() == 11) {
            return cleanPhone.substring(0, 3) + "-" + cleanPhone.substring(3, 7) + "-" + cleanPhone.substring(7);
        } else if (cleanPhone.length() == 10) {
            return cleanPhone.substring(0, 3) + "-" + cleanPhone.substring(3, 6) + "-" + cleanPhone.substring(6);
        } else {
        // 이미 형식이 맞다면 그대로 반환
        return phone;
        }
    }

    private Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    
    // 6자리 인증번호 생성
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }

    @PostMapping(value = "/refresh_token", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> refreshToken(HttpServletRequest request, HttpServletResponse httpServletResponse) {
        String refreshTokenFromCookie = null;
        Cookie[] cookies = request.getCookies();
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    refreshTokenFromCookie = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshTokenFromCookie == null || refreshTokenFromCookie.isBlank()) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰이 쿠키에 없습니다.");
        }

        try {
            // 1. 리프레시 토큰 자체의 유효성(서명, 만료) 검사
            if (!jwtUtil.validateToken(refreshTokenFromCookie)) {
                // 유효하지 않으면 쿠키 삭제 및 저장소에서도 삭제 시도
                clearRefreshTokenCookie(httpServletResponse);
                // kakaoId를 추출할 수 없으므로, 저장소에서 토큰 값 자체로 삭제하는 기능이 필요할 수 있으나, 여기선 생략
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("유효하지 않거나 만료된 리프레시 토큰입니다. 다시 로그인해주세요. (검증실패)");
            }

            String kakaoId = jwtUtil.getKakaoIdFromToken(refreshTokenFromCookie);

            // 2. 서버 저장소의 리프레시 토큰과 일치하는지 확인
            if (!refreshTokenService.validateStoredToken(kakaoId, refreshTokenFromCookie)) {
                clearRefreshTokenCookie(httpServletResponse); // 저장된 토큰과 불일치 시 쿠키 삭제
                refreshTokenService.removeToken(kakaoId); // 저장소에서도 삭제
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰이 서버에 저장된 토큰과 일치하지 않습니다. 다시 로그인해주세요.");
            }

            UserDTO user = userMapper.findByProvider(1, kakaoId);
            if (user == null) {
                clearRefreshTokenCookie(httpServletResponse);
                refreshTokenService.removeToken(kakaoId);
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰 사용자를 찾을 수 없습니다. 다시 로그인해주세요.");
            }

            // 새 액세스 토큰 발급 (카카오 액세스 토큰은 더 이상 사용하지 않거나, 필요 시 별도 관리)
            String newAppAccessToken = jwtUtil.generateAccessToken(kakaoId, user.getEmail(), user.getNickname(), "");

            Map<String, Object> responseBody = new HashMap<>();
            responseBody.put("accessToken", newAppAccessToken);
            responseBody.put("message", "액세스 토큰이 성공적으로 재발급되었습니다.");

            return ResponseEntity.ok(responseBody);

        } catch (ExpiredJwtException eje) {
            clearRefreshTokenCookie(httpServletResponse);
            // 만료된 토큰에서 kakaoId 추출 시도 및 삭제
            String kakaoIdFromExpiredToken = jwtUtil.getKakaoIdFromTokenEvenIfExpired(refreshTokenFromCookie);
            if (kakaoIdFromExpiredToken != null) {
                refreshTokenService.removeToken(kakaoIdFromExpiredToken);
                System.out.println("만료된 리프레시 토큰의 사용자 ID로 저장소에서 삭제 시도: " + kakaoIdFromExpiredToken);
            } else {
                // getKakaoIdFromTokenEvenIfExpired가 null을 반환한 경우 (예: 토큰 형식이 아예 잘못된 경우)
                System.err.println("재발급 시 만료된 리프레시 토큰에서 사용자 ID 추출 실패 (토큰 형식 오류 가능성).");
            }
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("리프레시 토큰이 만료되었습니다. 다시 로그인해주세요. (만료 예외)");
        } catch (Exception e) {
            e.printStackTrace();
            clearRefreshTokenCookie(httpServletResponse); // 일반 오류 발생 시에도 쿠키 정리 시도
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("토큰 재발급 처리 중 서버 오류가 발생했습니다: " + e.getMessage());
        }
    }
    
    // 로그아웃 
    @PostMapping(value = "/logout", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogout(
            @RequestBody(required = false) Map<String, String> requestBody, // 액세스 토큰은 이제 필수가 아닐 수 있음
            HttpServletRequest request, // 추가
            HttpServletResponse httpServletResponse // 추가
    ) {
        String accessToken = null;
        if (requestBody != null && requestBody.containsKey("accessToken")) {
            accessToken = requestBody.get("accessToken");
        } else {
            // Authorization 헤더에서도 액세스 토큰을 가져오는 로직 (선택적 추가)
            String authHeader = request.getHeader("Authorization");
            if (authHeader != null && authHeader.startsWith("Bearer ")) {
                accessToken = authHeader.substring(7);
            }
        }

        // 1. 액세스 토큰 블랙리스트 처리 (존재하고 유효하다면)
        if (accessToken != null && !accessToken.isBlank()) {
            try {
                // validateToken은 만료된 토큰도 false를 반환합니다.
                // 블랙리스트에는 만료 여부와 관계없이 '사용된' 토큰을 추가할 수 있습니다.
                // 다만, 이미 만료된 토큰을 굳이 블랙리스트에 추가할 필요는 없을 수 있습니다. 정책에 따라 결정.
                if (!tokenBlacklistService.isBlacklisted(accessToken)) { // 아직 블랙리스트에 없다면
                    tokenBlacklistService.addToBlacklist(accessToken); // 유효성 검사 없이 추가하거나, validateToken 후 추가
                    System.out.println("액세스 토큰 블랙리스트 추가: " + accessToken.substring(0, Math.min(10, accessToken.length())) + "...");
                }

                // 카카오 API를 통해 카카오 자체 토큰 만료 처리 (기존 로직 유지)
                // 이 부분은 앱의 액세스 토큰이 유효해야 getKakaoAccessToken 호출이 성공할 가능성이 높습니다.
                // 만약 앱 액세스 토큰이 만료되었어도 카카오 로그아웃을 시도하고 싶다면, getKakaoAccessToken 로직 견고성 필요.
                if (jwtUtil.validateToken(accessToken)) { // 액세스 토큰이 유효한 경우에만 카카오 로그아웃 시도
                    String kakaoOriginalAccessToken = jwtUtil.getKakaoAccessToken(accessToken);
                    if (kakaoOriginalAccessToken != null && !kakaoOriginalAccessToken.isEmpty()) {
                        try {
                            String logoutUrl = "https://kapi.kakao.com/v1/user/logout";
                            URL url = new URL(logoutUrl);
                            HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                            conn.setRequestMethod("POST");
                            conn.setRequestProperty("Authorization", "Bearer " + kakaoOriginalAccessToken);

                            int responseCode = conn.getResponseCode(); // 요청 보내기
                            // 응답 본문 읽기 (선택적)
                            BufferedReader br = new BufferedReader(new InputStreamReader(
                                    responseCode == 200 ? conn.getInputStream() : conn.getErrorStream()
                            ));
                            StringBuilder responseBuilder = new StringBuilder();
                            String line;
                            while ((line = br.readLine()) != null) {
                                responseBuilder.append(line);
                            }
                            br.close();
                            conn.disconnect();
                            System.out.println("카카오 로그아웃 API 응답 코드: " + responseCode + ", 응답: " + responseBuilder.toString());
                        } catch (Exception e) {
                            System.err.println("카카오 토큰 만료 처리 중 오류: " + e.getMessage());
                        }
                    }
                }
            } catch (Exception e) {
                System.err.println("로그아웃 시 액세스 토큰 처리 오류: " + e.getMessage());
            }
        }

        // 2. 리프레시 토큰 처리 (쿠키에서 읽고, 저장소에서 삭제)
        Cookie[] cookies = request.getCookies();
        String refreshTokenFromCookie = null;
        if (cookies != null) {
            for (Cookie cookie : cookies) {
                if (REFRESH_TOKEN_COOKIE_NAME.equals(cookie.getName())) {
                    refreshTokenFromCookie = cookie.getValue();
                    break;
                }
            }
        }

        if (refreshTokenFromCookie != null && !refreshTokenFromCookie.isBlank()) {
            String kakaoIdForCleanup = jwtUtil.getKakaoIdFromTokenEvenIfExpired(refreshTokenFromCookie);
            if (kakaoIdForCleanup != null) {
                refreshTokenService.removeToken(kakaoIdForCleanup);
                System.out.println("리프레시 토큰 저장소에서 삭제 완료 (사용자 ID: " + kakaoIdForCleanup + ")");
            } else {
                System.err.println("로그아웃: 리프레시 토큰에서 사용자 ID를 추출할 수 없습니다 (토큰이 심각하게 손상되었을 수 있음).");
                // 필요 시, 값 기반 삭제 로직 (refreshTokenService.removeTokenByValue(refreshTokenFromCookie)) 고려
            }
        }

        // 3. 리프레시 토큰 쿠키 삭제
        clearRefreshTokenCookie(httpServletResponse);

        return ResponseEntity.ok("로그아웃이 성공적으로 처리되었습니다.");
    }

    private void clearRefreshTokenCookie(HttpServletResponse httpServletResponse) {
        Cookie removedCookie = new Cookie(REFRESH_TOKEN_COOKIE_NAME, null);
        removedCookie.setMaxAge(0); // 즉시 만료
        removedCookie.setPath("/");
        removedCookie.setHttpOnly(true);
        removedCookie.setSecure(false); // TODO: HTTPS 시 true
        httpServletResponse.addCookie(removedCookie);
    }
     
    /**
     * 블랙리스트에 있는 토큰 목록 조회 (관리자용)
     */
    @GetMapping("/blacklist")
    public ResponseEntity<?> getBlacklistedTokens() {
        try {
            Map<String, Date> blacklistedTokens = tokenBlacklistService.getAllBlacklistedTokens();
            
            // 토큰 정보를 가공하여 반환 (토큰 자체는 민감 정보이므로 일부만 표시)
            Map<String, Object> result = new HashMap<>();
            
            blacklistedTokens.forEach((token, expiry) -> {
                try {
                    // 토큰에서 정보 추출
                    String kakaoId = jwtUtil.getKakaoIdFromToken(token);
                    String email = jwtUtil.getEmailFromToken(token);
                    String nickname = jwtUtil.getNicknameFromToken(token);
                    
                    // 토큰의 앞 10자와 뒤 5자만 표시
                    String maskedToken = token.length() > 15 
                        ? token.substring(0, 10) + "..." + token.substring(token.length() - 5)
                        : token;
                    
                    Map<String, Object> tokenInfo = new HashMap<>();
                    tokenInfo.put("token", maskedToken);
                    tokenInfo.put("kakaoId", kakaoId);
                    tokenInfo.put("email", email);
                    tokenInfo.put("nickname", nickname);
                    tokenInfo.put("expiry", expiry);
                    
                    result.put(maskedToken, tokenInfo);
                } catch (Exception e) {
                    // 토큰 파싱 오류 시 기본 정보만 포함
                    Map<String, Object> tokenInfo = new HashMap<>();
                    tokenInfo.put("token", token.substring(0, Math.min(10, token.length())) + "...");
                    tokenInfo.put("expiry", expiry);
                    tokenInfo.put("error", "토큰 정보 파싱 실패");
                    
                    result.put("invalid_token_" + result.size(), tokenInfo);
                }
            });
            
            return ResponseEntity.ok(result);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("블랙리스트 조회 중 오류: " + e.getMessage());
        }
    }
    
    /**
     * 특정 토큰의 블랙리스트 상태 확인
     */
    @PostMapping("/check-blacklist")
    public ResponseEntity<?> checkTokenBlacklist(@RequestBody Map<String, String> requestBody) {
        String token = requestBody.get("accessToken");
        if (token == null || token.isBlank()) {
            return ResponseEntity.badRequest().body("토큰이 필요합니다.");
        }
        
        try {
            boolean isBlacklisted = tokenBlacklistService.isBlacklisted(token);
            Date expiryDate = tokenBlacklistService.getBlacklistedTokenExpiry(token);
            
            Map<String, Object> response = new HashMap<>();
            response.put("blacklisted", isBlacklisted);
            
            if (isBlacklisted && expiryDate != null) {
                response.put("expiry", expiryDate);
                response.put("expired", expiryDate.before(new Date()));
            }
            
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("토큰 상태 확인 중 오류: " + e.getMessage());
        }
    }
}