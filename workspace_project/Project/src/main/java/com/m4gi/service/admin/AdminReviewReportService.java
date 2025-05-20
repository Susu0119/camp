package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import com.m4gi.mapper.admin.AdminReviewReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class AdminReviewReportService {

    private final AdminReviewReportMapper mapper;

    public List<AdminReviewReportDTO> getAllReports() {
        return mapper.findAll();
    }

    public boolean updateReportStatus(String reportId, String newStatus) {
        return mapper.updateStatus(reportId, newStatus) > 0;
        }

}
