package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.ReservationSummaryDTO;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.ReservationDTO;
import com.m4gi.mapper.ReservationMapper;
import java.util.List;

@Service
public class ReservationServiceImpl implements ReservationService {

    @Autowired
    private ReservationMapper reservationMapper;

    @Override
    public ReservationDTO findReservationById(String reservationId) {
        System.out.println("DB에서 예약 정보 조회 시도 - reservationId: " + reservationId);
        ReservationDTO reservation = reservationMapper.findById(reservationId);
        if (reservation == null) {
            System.out.println("예약 정보를 DB에서 찾을 수 없습니다. ID: " + reservationId);
        } else {
            System.out.println("예약 정보 조회 성공: " + reservation.getReservationSite());
        }
        return reservation;
    }

    @Override
    public List<ReservationDTO> getReservationsByProvider(Integer providerCode, String providerUserId) {
        return reservationMapper.findByProvider(providerCode, providerUserId);
    }

    @Override
    public List<ReservationSummaryDTO> getReservationSummariesByProvider(
            Integer providerCode, String providerUserId) {
        return reservationMapper.findReservationSummariesByUser(
                providerCode, providerUserId);
    }


    @Override
    public void updateReservationAsRefunded(String reservationId, String cancelReason) {
        reservationMapper.updateReservationAsRefunded(reservationId, cancelReason);
    }


}
