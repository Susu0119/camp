package com.m4gi.mapper;

import com.m4gi.dto.CampgroundSiteDTO;
import org.apache.ibatis.annotations.Mapper;


@Mapper
public interface SiteMapper {
    CampgroundSiteDTO findSiteById(String siteId);
}
