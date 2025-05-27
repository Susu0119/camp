package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminPaymentDTO;
import com.m4gi.mapper.admin.AdminPaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.w3c.dom.ls.LSInput;

import java.util.List;

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
