package com.m4gi.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
import com.m4gi.dto.UserMypageReservationsDTO;
import com.m4gi.mapper.UserMypageReservationsMapper;

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
	
	//예약 상세 조회
	@Override
	public List<UserMypageReservationsDTO> getOngoingReservations(int providerCode, String providerUserId) {
	    List<UserMypageReservationsDTO> list = UserMypageReservationsMapper.selectOngoingReservations(providerCode, providerUserId);

	    System.out.println("서비스에서 조회된 예약 리스트 크기: " + list.size());
	    for(UserMypageReservationsDTO dto : list) {
	        System.out.println(dto);
	    }

	    return list;
	}
	
	//예약 취소 
	@Override
	public int cancelReservation(CancelReservationRequestDTO dto) {
	    return UserMypageReservationsMapper.updateReservationCancel(
	        dto.getReservationId(),
	        dto.getCancelReason(),
	        dto.getRefundStatus(),
	        new java.sql.Timestamp(dto.getRequestedAt().getTime()) // java.sql.Date 또는 Timestamp로 변환
	    );
	}
	

	//사용자의 예약 취소 버튼 클릭 시 db에 취소 상태 업데이트 
	@Override
	public int updateReservationCancel(CancelReservationRequestDTO dto) {
	    if (dto.getRequestedAt() == null) {
	        dto.setRequestedAt(new java.util.Date());
	    }

	    return UserMypageReservationsMapper.updateReservationCancel(
	        dto.getReservationId(),
	        dto.getCancelReason(),
	        dto.getRefundStatus(),
	        new java.sql.Timestamp(dto.getRequestedAt().getTime())
	    );
	}

	
	//예약 취소/환불 내역 조회
	 @Override
	    public List<CanceledReservationsDTO> getCanceledReservations(int providerCode, String providerUserId) {
	        return UserMypageReservationsMapper.getCanceledReservations(providerCode, providerUserId);
	    }
	
}
