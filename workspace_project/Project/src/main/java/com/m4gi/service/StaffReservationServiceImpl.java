package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.m4gi.dto.StaffReservationDTO;
import com.m4gi.mapper.StaffReservationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffReservationServiceImpl implements StaffReservationService {
	
	private final StaffReservationMapper reservationMapper;
	
	// 캠핑장 관계자 - 전체 예약 조회
	@Override
	public List<StaffReservationDTO> getReservationsByOwnerAndDate(int providerCode, String providerUserId, LocalDate startDate, LocalDate endDate) {
        return reservationMapper.selectReservationsByOwnerAndDate(providerCode, providerUserId, startDate, endDate);
    };
	
	// 캠핑장 관계자 - 체크인 처리
    @Override
    @Transactional
	public boolean checkInReservation(String reservationId) {
        int updated = reservationMapper.checkInReservation(reservationId);
        return updated > 0;
    };
    
    // 수동 퇴실 처리
    @Override
    @Transactional
    public boolean checkOutReservation(String reservationId) {
    	return reservationMapper.checkOutReservation(reservationId) > 0;
    }
    
    // 자동 퇴실 처리
 	@Override
 	@Transactional
 	public int autoCheckoutReservations() {
 		return reservationMapper.autoCheckoutReservations();
 	}
	
};
