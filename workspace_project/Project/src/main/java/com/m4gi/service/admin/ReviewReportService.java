package com.m4gi.service.admin;

import com.m4gi.dto.admin.ReviewReportDTO;
import com.m4gi.mapper.admin.ReviewReportMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class ReviewReportService {

    private final ReviewReportMapper mapper;

    public List<ReviewReportDTO> getAllReports() {
        return mapper.findAll();
    }

    public boolean updateReportStatus(String reportId, String newStatus) {
        return mapper.updateStatus(reportId, newStatus) > 0;
        }

}dasd
