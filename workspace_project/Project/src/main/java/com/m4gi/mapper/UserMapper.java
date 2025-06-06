package com.m4gi.mapper;

import com.m4gi.dto.UserDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface UserMapper {
	
	void updateUserProfile(UserDTO user);

    // 1. 전체 사용자 조회
    List<UserDTO> findAllUsers();

    // 2. 소셜 로그인 - provider 기준 조회 (예: 카카오, 네이버 등)
    UserDTO findByProvider(@Param("providerCode") int providerCode, @Param("providerUserId") String providerUserId);

    // 3. 카카오 ID로 조회 (provider_code = 1)
    UserDTO findByKakaoId(String providerUserId); // 내부적으로 provider_code = 1 조건 포함됨

    // 4. 전화번호로 사용자 조회
    UserDTO findByPhone(String phone);

    // 5. 전화번호 업데이트 (카카오 ID 기준)
    void updatePhoneByKakaoId(@Param("phone") String phone, @Param("providerUserId") String providerUserId);

    // 6. 신규 사용자 등록
    void insertUser(UserDTO user);

    // 7. 사용자 권한 변경 (user_role)
    void updateUserRole(@Param("userId") String userId, @Param("role") String role);

    // 8. 사용자 상태 변경 (user_status 등)
    void updateUserStatus(@Param("userId") String userId, @Param("status") String status);
    
    // 9. 사용자 프로필 이미지 변경
    int updateProfileImage(@Param("providerCode") int providerCode,
            @Param("providerUserId") String providerUserId,
            @Param("profileImageUrl") String profileImageUrl);
   
    
  //닉네임 중복 체크
  boolean existsNickname(@Param("nickname") String nickname);
    
    // 10. 사용자 닉네임 변경
    void updateUserNickname(UserDTO user);
    
    // 11. 사용자 조회
    UserDTO getUserById(@Param("providerCode") int providerCode, 
            @Param("providerUserId") String providerUserId);

    UserDTO findByProviderCodeAndProviderUserId(@Param("providerCode") int providerCode,
            @Param("providerUserId") String providerUserId);

    // 11. 회원 탈퇴
    void withdrawUser(@Param("providerCode") int providerCode,
                      @Param("providerUserId") String providerUserId,
                      @Param("status") int status,
                      @Param("reason") String reason);


    UserDTO findByEmail(@Param("email") String email);

    // 예약할때 로그인 유저 정보 가져오기
    UserDTO selectByProvider(@Param("providerCode") int providerCode,
            @Param("providerUserId") String providerUserId);


}
