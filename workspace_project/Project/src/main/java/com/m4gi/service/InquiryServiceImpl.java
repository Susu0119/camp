package com.m4gi.service;

import com.m4gi.dto.InquiryDTO;
import com.m4gi.mapper.InquiryMapper;
import com.m4gi.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Service
public class InquiryServiceImpl implements InquiryService {

    @Autowired
    private InquiryMapper mapper;

    @Override
    public String createInquiry(InquiryDTO dto) {
        dto.setInquiriesId(UUID.randomUUID().toString());
        dto.setInquiriesStatus(0); // 미답변 상태 고정
        mapper.insertInquiry(dto);
        return dto.getInquiriesId();
    }
}
