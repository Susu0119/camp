package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import com.m4gi.dto.admin.AdminReviewReportDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminReviewReportMapper {
    List<AdminReviewReportDTO> findAll();

    int updateStatus(@Param("reportId") String reportId, @Param("status") int status);

    AdminReviewReportDetailDTO findById(@Param("reportId") String reportId);

    List<AdminReviewReportDTO> searchReports(Map<String, Object> params);

}