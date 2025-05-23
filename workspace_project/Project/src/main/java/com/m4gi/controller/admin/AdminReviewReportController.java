package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import com.m4gi.service.admin.AdminReviewReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/reports")
public class AdminReviewReportController {

    private final AdminReviewReportService reportService;

    public AdminReviewReportController(AdminReviewReportService reportService) {
        this.reportService = reportService;
    }

    @GetMapping
    public ResponseEntity<List<AdminReviewReportDTO>> getAllReports() {
        return ResponseEntity.ok(reportService.getAllReports());
    }

    @PatchMapping(value = "/{reportId}", produces = "application/json; charset=UTF-8")
    public ResponseEntity<String> updateReportStatus(
            @PathVariable String reportId,
            @RequestBody Map<String, Integer> body
    ) {
        Integer newStatus = body.get("status");
        if (newStatus == null) return ResponseEntity.badRequest().body("상태값 누락");

        boolean updated = reportService.updateReportStatus(reportId, newStatus);
        return updated ? ResponseEntity.ok("업데이트 완료") : ResponseEntity.badRequest().body("해당 신고 없음");
    }
}
