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
    public boolean updateProfileImage(int providerCode, String providerUserId, String profileImageUrl) {
        System.out.println("updateProfileImage 호출됨: " + providerCode + ", " + providerUserId + ", " + profileImageUrl);
        int result = userMapper.updateProfileImage(providerCode, providerUserId, profileImageUrl);
        System.out.println("update 결과: " + result);
        return result == 1;
    }

}
