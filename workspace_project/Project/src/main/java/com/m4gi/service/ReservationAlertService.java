package com.m4gi.service;

import java.util.ArrayList;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Stream; 

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.mapper.ReservationAlertMapper;
import com.m4gi.dto.ReservationAlertDTO;

@Service
public class ReservationAlertService {

    @Autowired
    private ReservationAlertMapper reservationAlertMapper;

    public List<ReservationAlertDTO> getReservationAlertsForUser(Integer providerCode, String providerUserId) {
        // 1. 예약 완료 알림 가져오기
        List<ReservationAlertDTO> completedAlerts = reservationAlertMapper.selectCompletedReservationsForAlerts(providerCode, providerUserId);

        // 2. 예약 취소 알림 가져오기
        List<ReservationAlertDTO> canceledAlerts = reservationAlertMapper.selectCanceledReservationsForAlerts(providerCode, providerUserId);

        // 3. 두 리스트를 합치기 (Stream API를 사용하여 깔끔하게)
        List<ReservationAlertDTO> allReservationAlerts = Stream.concat(
            completedAlerts.stream(),
            canceledAlerts.stream()
        ).collect(ArrayList::new, ArrayList::add, ArrayList::addAll);

        // 4. 생성 시간 기준으로 최신순 정렬
        // Comparator.nullsLast: createdAt이 null인 경우를 대비하여 null 값을 마지막에 배치
        // Comparator.reverseOrder(): 내림차순 (최신순) 정렬
        allReservationAlerts.sort(Comparator.comparing(ReservationAlertDTO::getCreatedAt, Comparator.nullsLast(Comparator.reverseOrder())));

        return allReservationAlerts;
    }

}