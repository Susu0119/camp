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
    public List<AdminPaymentDetailDTO> findAllPayments(Integer reservationStatus, Integer paymentStatus, Integer approvalStatus, String sortOrder, String keyword, String startDate, String endDate) {
        Map<String, Object> params = new HashMap<>();
        params.put("reservationStatus", reservationStatus);
        params.put("paymentStatus", paymentStatus);
        params.put("approvalStatus", approvalStatus);
        params.put("sortOrder", sortOrder);
        params.put("keyword", keyword);
        params.put("startDate", startDate);
        params.put("endDate", endDate);

        return paymentMapper.findAllPayments(params);
    }

    @Override
    public AdminPaymentDetailDTO findPaymentByPaymentId(String paymentId) {
        return paymentMapper.findPaymentByPaymentId(paymentId);
    }

}
