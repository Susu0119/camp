package com.m4gi.controller;

import com.m4gi.dto.InquiryDTO;
import com.m4gi.dto.UserDTO;
import com.m4gi.service.InquiryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.Collections;
import java.util.Map;

@Controller
@RequestMapping("/api/cs/inquiries")
public class InquiryController {

    @Autowired
    private InquiryService service;

    /** 사용자 문의 등록 */
    @PostMapping
    @ResponseBody
    public Map<String, String> createInquiry(
            @RequestBody InquiryDTO dto,
            @SessionAttribute("loginUser") UserDTO user
    ) {
        dto.setProviderCode(user.getProviderCode());
        dto.setProviderUserId(user.getProviderUserId());

        String id = service.createInquiry(dto);
        return Collections.singletonMap("inquiryId", id);
    }
}
