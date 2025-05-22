package com.m4gi.service;

import java.util.List;

import com.m4gi.mapper.UserMypageReservationsMapper;

import org.springframework.stereotype.Service;

import com.m4gi.dto.UserMypageReservationsDTO;

import com.m4gi.service.UserMypageReservationsService;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UserMypageReservationsImpl implements UserMypageReservationsService{
	private final UserMypageReservationsMapper UserMypageReservationsMapper;

	@Override
    public List<UserMypageReservationsDTO> getOngoingReservations(int providerCode, String providerUserId) {
        return UserMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);
    }
}
