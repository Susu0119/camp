package com.m4gi.service;

import com.m4gi.dto.SiteDTO;
import java.util.List;

public interface SiteService {
    List<SiteDTO> getSitesByZone(String zoneId);
}
