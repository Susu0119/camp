package com.m4gi.service;

import java.sql.Date;
import java.util.List;

import com.m4gi.mapper.UserMypageReservationsMapper;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.CancelReservationRequestDTO;
import com.m4gi.dto.CanceledReservationsDTO;
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
	
//	@Override
//    public int updateReservationCancel(CancelReservationRequestDTO dto) throws Exception {
//        // 실제 예약 취소 처리 로직 작성
//        // 예) DB 업데이트, 상태 변경, 트랜잭션 처리 등
//        // 구현 예시:
//        // return reservationRepository.cancelReservation(dto.getReservationId(), dto.getCancelReason(), dto.getRefundStatus(), dto.getRequestedAt());
//
//        // 지금은 임시로 성공했다고 가정하고 1 반환
//        return 1;
//    }
	//사용자의 예약 취소 버튼 클릭 시 db에 취소 상태 업데이트 
	@Override
	public int updateReservationCancel(CancelReservationRequestDTO dto) {
	    // 실제 구현이 필요한 경우 여기에 로직 작성
	    // 예: 예약 취소 관련 로직
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
