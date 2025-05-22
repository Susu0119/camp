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

//	@Override
//    public List<UserMypageReservationsDTO> getOngoingReservations(int providerCode, String providerUserId) {
//
//		return UserMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);
//    }
	
	@Override
	public List<UserMypageReservationsDTO> getOngoingReservations(int providerCode, String providerUserId) {
	    List<UserMypageReservationsDTO> list = UserMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);

	    System.out.println("서비스에서 조회된 예약 리스트 크기: " + list.size());
	    for(UserMypageReservationsDTO dto : list) {
	        System.out.println(dto);
	    }

	    return list;
	}

}
