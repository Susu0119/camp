package com.m4gi.service;

import com.m4gi.dto.UserDTO;
import com.m4gi.mapper.UserMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserMapper userMapper;

    @Override
    public UserDTO getUserByProvider(int providerCode, String providerUserId) {
        return userMapper.selectByProvider(providerCode, providerUserId);
    }
}
