package com.m4gi.service;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.dto.ReservationDTO;
import com.m4gi.mapper.PaymentMapper;
import com.m4gi.mapper.ReservationMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentMapper paymentMapper;

    @Autowired
    private ReservationMapper reservationMapper;

    @Override
    @Transactional
    public void savePaymentAndReservation(PaymentDTO paymentDTO) {
        ReservationDTO reservation = paymentDTO.getReservation();

        // 예약 ID 생성
        String reservationId = reservationMapper.getLastReservationId();
        reservation.setReservationId(reservationId);

        // 결제 ID 생성
        String paymentId = paymentMapper.getLastPaymentId();
        paymentDTO.setPaymentId(paymentId);
        paymentDTO.setReservationId(reservationId);

        // 저장
        reservationMapper.insertReservation(reservation);
        paymentMapper.insertPayment(paymentDTO);
    }
}
