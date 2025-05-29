package com.m4gi.controller;

import com.m4gi.dto.SiteDTO;
import com.m4gi.service.SiteService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    @Autowired
    private SiteService siteService;

    @GetMapping("/byZone")
    public List<SiteDTO> getSitesByZone(@RequestParam("zoneId") String zoneId) {
        return siteService.getSitesByZone(zoneId);
    }
}
