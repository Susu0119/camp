package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminPaymentDetailDTO;
import com.m4gi.mapper.admin.AdminPaymentMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminPaymentServiceImpl implements AdminPaymentService {

    private final AdminPaymentMapper paymentMapper;

    @Override
    public List<AdminPaymentDetailDTO> findAllPayments(Integer reservationStatus, Integer paymentStatus, String sortOrder) {
        Map<String, Object> params = new HashMap<>();
        params.put("reservationStatus", reservationStatus);
        params.put("paymentStatus", paymentStatus);
        params.put("sortOrder", sortOrder);

        return paymentMapper.findAllPayments(params);
    }

    @Override
    public AdminPaymentDetailDTO findPaymentByReservationId(String reservationId) {
        return paymentMapper.findPaymentByReservationId(reservationId);
    }
}
