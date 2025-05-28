package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import com.m4gi.dto.admin.AdminReviewReportDetailDTO;
import com.m4gi.mapper.admin.AdminReviewReportMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    public AdminReviewReportDetailDTO getDetail(String reportId) {
        return mapper.findById(reportId);
    }

    public List<AdminReviewReportDTO> searchReports(String status, String keyword, String sortOrder) {
        Map<String, Object> params = new HashMap<>();
        params.put("status", status);
        params.put("keyword", keyword);
        params.put("sortOrder", sortOrder);

        return mapper.searchReports(params);
    }
}
