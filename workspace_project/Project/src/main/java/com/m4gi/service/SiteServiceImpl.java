package com.m4gi.service;

import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.mapper.SiteMapper;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SiteServiceImpl implements SiteService {

    @Autowired
    private SiteMapper siteMapper;

    @Override
    public CampgroundSiteDTO getSiteById(int siteId) {
        return siteMapper.findSiteById(siteId);
    }
}