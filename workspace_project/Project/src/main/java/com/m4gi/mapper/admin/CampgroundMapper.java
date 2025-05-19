package com.m4gi.mapper.admin;

import com.m4gi.dto.admin.CampgroundDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface CampgroundMapper {

    List<CampgroundDTO> findAll();

    CampgroundDTO findById(@Param("id") String id);

    void insert(CampgroundDTO dto);

    void updateStatus(@Param("id") String id, @Param("status") int status);
}
