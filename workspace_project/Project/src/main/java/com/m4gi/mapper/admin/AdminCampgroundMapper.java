package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminCampgroundDTO;
import com.m4gi.dto.admin.AdminCampgroundDetailDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;
import java.util.Map;

@Mapper
public interface AdminCampgroundMapper {

    List<AdminCampgroundDTO> findAll();

    AdminCampgroundDTO findById(@Param("id") int id);

    void insert(AdminCampgroundDTO dto);

    void updateStatus(@Param("id") int id, @Param("status") int status);

    AdminCampgroundDetailDTO findCampgroundDetailById(@Param("campgroundId") int campgroundId);

    List<AdminCampgroundDTO> search(Map<String, Object> params);

}
