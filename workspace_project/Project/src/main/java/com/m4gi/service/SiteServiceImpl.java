package com.m4gi.service;

import com.m4gi.dto.SiteDTO;
import com.m4gi.mapper.SiteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SiteServiceImpl implements SiteService {

    @Autowired
    private SiteMapper siteMapper;

    @Override
    public List<SiteDTO> getSitesByZone(String zoneId) {
        return siteMapper.findSitesByZone(zoneId);
    }
}
