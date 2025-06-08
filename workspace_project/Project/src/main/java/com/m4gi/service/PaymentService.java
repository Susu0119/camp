package com.m4gi.service;

import com.m4gi.dto.PaymentDTO;

public interface PaymentService {
    void savePaymentAndReservation(PaymentDTO paymentDTO);

    // 남은 자리 검증 메서드
    boolean validateAvailableSpots(int zoneId, String startDate, String endDate);

    // 사이트 ID로 구역 ID 찾기
    Integer getZoneIdBySiteId(String siteId);
    
    // 중복 결제 조회
    boolean existsByReservationId(String reservationId);
    
}
