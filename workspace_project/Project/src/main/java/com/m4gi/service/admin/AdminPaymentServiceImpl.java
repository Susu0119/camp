package com.m4gi.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.m4gi.dto.admin.AdminPaymentDTO;
import com.m4gi.mapper.admin.AdminPaymentMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminPaymentServiceImpl implements AdminPaymentService {

    private final AdminPaymentMapper paymentMapper;

    @Override
    public List<AdminPaymentDTO> findAllPayments() {
        return paymentMapper.findAllPayments();
    }

    @Override
    public AdminPaymentDTO findPaymentByReservationId(String reservationId) {
        return paymentMapper.findPaymentByReservationId(reservationId);
    }
}
