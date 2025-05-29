package com.m4gi.mapper;

import com.m4gi.dto.SiteDTO;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import java.util.List;

@Mapper
public interface SiteMapper {
    List<SiteDTO> findSitesByZone(@Param("zoneId") String zoneId);
}
