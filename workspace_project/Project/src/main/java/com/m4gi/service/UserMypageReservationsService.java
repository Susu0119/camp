package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.UserMypageReservationsDTO;

public interface UserMypageReservationsService {
	
	List<UserMypageReservationsDTO>getOngoingReservations(
			int providerCode, String providerUserId);
}
