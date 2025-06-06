package com.m4gi.service;

import com.m4gi.dto.UserDTO;

public interface UserService {
    UserDTO getUserByProvider(int providerCode, String providerUserId);

    boolean updateProfileImage(int providerCode, String providerUserId, String profileImage);
}
