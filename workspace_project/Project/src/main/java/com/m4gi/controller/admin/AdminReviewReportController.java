package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import com.m4gi.service.admin.AdminReviewReportService;
import com.m4gi.util.KeywordNormalizer;
import org.apache.ibatis.javassist.compiler.ast.Keyword;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;
import java.util.function.ObjIntConsumer;

@RestController
@RequestMapping("/admin/reports")
public class AdminReviewReportController {

    private final AdminReviewReportService reportService;

    public AdminReviewReportController(AdminReviewReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public List<AdminReviewReportDTO> getAllReports() {
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