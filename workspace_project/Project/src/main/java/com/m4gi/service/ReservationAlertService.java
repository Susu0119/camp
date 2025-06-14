// src/main/java/com/m4gi/service/ReservationAlertService.java
package com.m4gi.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.m4gi.dto.ReservationAlertDTO;
import com.m4gi.mapper.ReservationAlertMapper;

@Service
public class ReservationAlertService {

    @Autowired
    private ReservationAlertMapper reservationAlertMapper;

    /**
     * 특정 사용자의 예약 알림을 동적으로 생성하여 가져옵니다.
     * 이 알림은 DB에 별도로 저장되지 않고, 'reservations' 테이블에서 직접 조회하여 생성됩니다.
     *
     * @param providerCode 사용자의 providerCode
     * @param providerUserId 사용자의 providerUserId
     * @return 동적으로 생성된 예약 알림 목록 (ReservationAlertDTO)
     */
    public List<ReservationAlertDTO> getUserReservationAlerts(int providerCode, String providerUserId) {
        return reservationAlertMapper.selectUserReservationAlerts(providerCode, providerUserId);
    }
}