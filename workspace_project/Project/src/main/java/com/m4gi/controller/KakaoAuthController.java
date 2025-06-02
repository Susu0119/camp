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
import com.m4gi.util.JwtUtil;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/oauth/kakao")
@CrossOrigin(
        origins = "http://localhost:5173",  // 프론트 주소
        allowCredentials = "true"
)
public class KakaoAuthController {
	
    private final UserMapper userMapper;
    private final JwtUtil jwtUtil;

    @Value("${kakao.rest-api-key}")
    private String kakaoRestApiKey;

    @PostMapping(value = "/callback", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogin(@RequestBody Map<String, String> requestBody) {

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
            String accessToken = tokenJson.path("access_token").asText(null);
            if (accessToken == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("액세스 토큰 획득에 실패했습니다.");
            }

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
            String kakaoId = userJson.path("id").asText(null);
            String email = userJson.path("kakao_account").path("email").asText(null);

            if (kakaoId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("카카오 사용자 정보를 가져올 수 없습니다.");
            }

            // 3. 기존 사용자 확인
            UserDTO existingUser = userMapper.findByProvider(1, kakaoId);

            if (existingUser != null && existingUser.getPhone() != null && !existingUser.getPhone().isBlank()) {
                // 기존 사용자이고 전화번호가 있는 경우 - 로그인 성공
                String jwtToken = jwtUtil.generateToken(kakaoId, existingUser.getEmail(), existingUser.getNickname());
                
                Map<String, Object> response = new HashMap<>();
                response.put("message", "로그인 성공");
                response.put("token", jwtToken);
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
            return ResponseEntity.ok(response);
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

    // 임시 인증번호 저장소 (실제로는 Redis 사용 권장)
    private Map<String, String> verificationCodes = new ConcurrentHashMap<>();
    
    // 6자리 인증번호 생성
    private String generateVerificationCode() {
        Random random = new Random();
        return String.format("%06d", random.nextInt(1000000));
    }
    

    // 로그아웃 
    @PostMapping(value = "/logout", produces = "application/json; charset=UTF-8")
    public ResponseEntity<?> kakaoLogout(@RequestBody Map<String, String> requestBody) {
        String accessToken = requestBody.get("accessToken");
        if (accessToken == null || accessToken.isBlank()) {
            return ResponseEntity.badRequest().body("액세스 토큰이 필요합니다.");
        }
        try {
            RestTemplate rt = new RestTemplate();
            HttpHeaders headers = new HttpHeaders();
            headers.add("Authorization", "Bearer " + accessToken);
            headers.setContentType(MediaType.APPLICATION_FORM_URLENCODED);  // 명시적으로 설정
            HttpEntity<String> logoutRequest = new HttpEntity<>(null, headers);
            ResponseEntity<String> response = rt.postForEntity(
                    "https://kapi.kakao.com/v1/user/logout",
                    logoutRequest,
                    String.class
            );

            if (response.getStatusCode() == HttpStatus.OK) {
                return ResponseEntity.ok("로그아웃이 완료되었습니다.");
            } else {
                return ResponseEntity.status(response.getStatusCode())
                        .body("카카오 로그아웃 실패: " + response.getBody());
            }

        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("로그아웃 처리 중 오류: " + e.getMessage());
        }
    }    
    
}
