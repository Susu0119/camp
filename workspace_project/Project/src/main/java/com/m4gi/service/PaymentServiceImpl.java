package com.m4gi.service;

import com.m4gi.dto.PaymentDTO;
import com.m4gi.mapper.PaymentMapper;
import com.m4gi.service.PaymentService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class PaymentServiceImpl implements PaymentService {

    @Autowired
    private PaymentMapper paymentMapper;

    @Override
    @Transactional
    public void createPayment(PaymentDTO dto) {
        paymentMapper.insert(dto);
        // 추후 PG 결과 검증, 예약 상태 업데이트 등 비즈니스 로직 추가 예정
    }
}
