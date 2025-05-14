package com.m4gi.service.admin;

import com.m4gi.dto.admin.ReviewReportDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class ReviewReportService {

    private final List<ReviewReportDTO> reportList = new ArrayList<>(List.of(
            new ReviewReportDTO("R001", "RV101", "naver_abc", "욕설", "대기"),
            new ReviewReportDTO("R002", "RV102", "kakao_xyz", "도배", "처리완료")
    ));

    public List<ReviewReportDTO> getAllReports() {
        return reportList;
    }

    public boolean updateReportStatus(String reportId, String newStatus) {
        for (ReviewReportDTO report : reportList) {
            if (report.getReportId().equals(reportId)) {
                report.setStatus(newStatus);
                return true;
            }
        }
        return false;
    }

}
