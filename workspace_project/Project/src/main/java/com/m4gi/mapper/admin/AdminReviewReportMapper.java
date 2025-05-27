package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminReviewReportDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminReviewReportMapper {
    List<AdminReviewReportDTO> findAll();

    int updateStatus(@Param("reportId") String reportId, @Param("status") int status);
}