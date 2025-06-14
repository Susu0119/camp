package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.ReservationDTO; // ReservationDTO 임포트 (addReservation에 필요할 수 있음)
import com.m4gi.dto.ReservationResponseDTO;
import com.m4gi.dto.UserDTO; // UserDTO 임포트 추가

import java.util.List;

public interface UserMypageReservationsService {
	
	List<ReservationResponseDTO> getOngoingReservations(int providerCode, String providerUserId);
    List<ReservationResponseDTO> getCompletedReservations(int providerCode, String providerUserId);
    List<ReservationResponseDTO> getCanceledReservations(int providerCode, String providerUserId);

    // 이 메서드는 기존 cancelReservation(CancelReservationRequestDTO dto)와 동일한 시그니처를 가집니다.
    int cancelReservation(CancelReservationRequestDTO dto);
    
    // ✅ 이 메서드 시그니처가 UserMypageReservationsImpl과 정확히 일치해야 합니다.
    int updateReservationCancel(CancelReservationRequestDTO dto, UserDTO currentUser) throws Exception;

    // ReservationDTO 임포트가 없어서 addReservation 메서드가 오류를 낼 수 있으므로 추가했습니다.
    void addReservation(ReservationDTO reservation);
}
