package com.m4gi.controller;

import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.service.SiteService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sites")
public class SiteController {

    @Autowired
    private SiteService siteService;

    // siteId로 단일 사이트 조회
    @GetMapping("/byId")
    public ResponseEntity<CampgroundSiteDTO> getSiteById(@RequestParam int siteId) {
        CampgroundSiteDTO site = siteService.getSiteById(siteId);
        if (site == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(site);
    }
}
