package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.ReviewReportDTO;
import org.apache.ibatis.annotations.Param;

import java.util.List;

public interface ReviewReportMapper {

    // 전체 신고 조회
    List<ReviewReportDTO> findAll();

    // 상태 변경
    int updateStatus(@Param("reportId") String reportId, @Param("status") String status);
}
