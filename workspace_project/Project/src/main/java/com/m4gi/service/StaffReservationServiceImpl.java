package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.m4gi.dto.DailyReservationStatusDTO;
import com.m4gi.dto.StaffReservationDTO;
import com.m4gi.mapper.StaffReservationMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffReservationServiceImpl implements StaffReservationService {
	
	private final StaffReservationMapper reservationMapper;
	
	// 캠핑장 관계자 - 전체 예약 조회
	@Override
    public DailyReservationStatusDTO getReservationsByOwnerAndDate(int providerCode, String providerUserId, LocalDate startDate, LocalDate endDate) {
        
        // DB에서 기간 내 입실 또는 퇴실하는 모든 예약을 한 번에 조회
        List<StaffReservationDTO> allReservations = reservationMapper.selectReservationsByOwnerAndDate(providerCode, providerUserId, startDate, endDate);

        List<StaffReservationDTO> checkInList = allReservations.stream()
            .filter(reservation -> {
                LocalDate checkInDate = LocalDate.parse(reservation.getCheckInDate());
                return !checkInDate.isBefore(startDate) && !checkInDate.isAfter(endDate);
            })
            .collect(Collectors.toList());

        List<StaffReservationDTO> checkOutList = allReservations.stream()
            .filter(reservation -> {
                LocalDate checkOutDate = LocalDate.parse(reservation.getCheckOutDate());
                return !checkOutDate.isBefore(startDate) && !checkOutDate.isAfter(endDate);
            })
            .collect(Collectors.toList());

        // 분리된 리스트를 새로운 DTO에 담아 반환
        return new DailyReservationStatusDTO(checkInList, checkOutList);
    }
	
	// '기간 내 숙박' 조회
	@Override
    public List<StaffReservationDTO> getReservationsOverlappingPeriod(int providerCode, String providerUserId, LocalDate startDate, LocalDate endDate) {
        return reservationMapper.selectReservationsOverlappingPeriod(providerCode, providerUserId, startDate, endDate);
	}
	
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
