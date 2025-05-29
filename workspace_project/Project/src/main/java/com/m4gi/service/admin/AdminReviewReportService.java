package com.m4gi.service.admin;

import java.util.List;

import org.springframework.stereotype.Service;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import com.m4gi.mapper.admin.AdminReviewReportMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class AdminReviewReportService {

    private final AdminReviewReportMapper mapper;

    public List<AdminReviewReportDTO> getAllReports() {
        return mapper.findAll();
    }

    public boolean updateReportStatus(String reportId, int newStatus) {
        return mapper.updateStatus(reportId, newStatus) > 0;
    }
}
