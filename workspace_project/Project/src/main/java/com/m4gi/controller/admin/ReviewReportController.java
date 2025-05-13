package com.m4gi.controller.admin;

import com.m4gi.dto.admin.ReviewReportDTO;
import com.m4gi.service.admin.ReviewReportService;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/reports")
public class ReviewReportController {

    private final ReviewReportService reportService;

    public ReviewReportController(ReviewReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<ReviewReportDTO> getAllReports() {
        return reportService.getAllReports();
    }

    @PatchMapping(value = "/{reportId}", produces = "text/plain; charset=UTF-8")
    public String updateReportStatus(
            @PathVariable String reportId,
            @RequestBody Map<String , String> body
    ) {
        String newStatus = body.get("status");
        boolean updated = reportService.updateReportStatus(reportId, newStatus);
        return updated ? "업데이트 완료" : "해당신고 없음";

    }

}
