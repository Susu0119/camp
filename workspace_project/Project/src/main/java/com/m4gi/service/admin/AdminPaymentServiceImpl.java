package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminPaymentDetailDTO;
import com.m4gi.mapper.admin.AdminPaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminPaymentServiceImpl implements AdminPaymentService {

    private final AdminPaymentMapper paymentMapper;

    @Override
    public List<AdminPaymentDetailDTO> findAllPayments() {
        return paymentMapper.findAllPayments();
    }

    @Override
    public AdminPaymentDetailDTO findPaymentByReservationId(String reservationId) {
        return paymentMapper.findPaymentByReservationId(reservationId);
    }
}
