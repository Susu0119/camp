package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.UserMypageReservationsDTO;

public interface UserMypageReservationsService {
	
	//사용자 예약 목록 조회
	List<UserMypageReservationsDTO>getOngoingReservations(
			int providerCode, String providerUserId);
	
	//사용자 예약 취소 
	int cancelReservation(CancelReservationRequestDTO dto);
	int updateReservationCancel(CancelReservationRequestDTO dto) throws Exception;

}
