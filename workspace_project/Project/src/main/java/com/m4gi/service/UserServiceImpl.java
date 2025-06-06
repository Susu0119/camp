package com.m4gi.service;

import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@Transactional
public class UserServiceImpl implements UserService {

    private final UserMapper userMapper;

    @Autowired
    public UserServiceImpl(UserMapper userMapper) {
        this.userMapper = userMapper;
    }

    @Override
    public UserDTO getUserByProvider(int providerCode, String providerUserId) {
        return userMapper.selectByProvider(providerCode, providerUserId);
    }

    @Override
    public boolean updateProfileImage(int providerCode, String providerUserId, String profileImage) {
        System.out.println("updateProfileImage 호출됨: " + providerCode + ", " + providerUserId + ", " + profileImage);
        int result = userMapper.updateProfileImage(providerCode, providerUserId, profileImage);
        System.out.println("update 결과: " + result);

        // 업데이트 직후 사용자 정보 다시 조회해보기
        UserDTO user = userMapper.selectByProvider(providerCode, providerUserId);
        System.out.println("업데이트 후 사용자 정보: " + user);

        return result == 1;
    }


}
