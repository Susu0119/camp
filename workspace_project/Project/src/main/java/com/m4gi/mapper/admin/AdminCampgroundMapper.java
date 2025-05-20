package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.AdminCampgroundDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface AdminCampgroundMapper {

    List<AdminCampgroundDTO> findAll();

    AdminCampgroundDTO findById(@Param("id") String id);

    void insert(AdminCampgroundDTO dto);

    void updateStatus(@Param("id") String id, @Param("status") int status);
}
