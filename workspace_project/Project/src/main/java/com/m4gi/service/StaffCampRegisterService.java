package com.m4gi.service;

import java.util.List;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.dto.SiteInfoDTO;
import com.m4gi.dto.ZoneDetailDTO;
import com.m4gi.dto.ZoneInfoDTO;

public interface StaffCampRegisterService {

	RegistCampgroundDTO registerCampground(RegistCampgroundDTO dto, Integer providerCode, String providerUserId);
	RegistCampgroundDTO getCampsiteDetailsById(Integer campgroundId);
	RegistCampgroundDTO updateCampground(RegistCampgroundDTO dto, Integer providerCode, String providerUserId);
	
	RegistZoneDTO registerZone(RegistZoneDTO dto);
	ZoneDetailDTO getZoneDetailsById(Integer zoneId, Integer ownedCampgroundId);
	void updateZone(Integer zoneId, RegistZoneDTO dto, Integer ownedCampgroundId);
	
	Integer getOwnedCampgroundId(Integer providerCode, String providerUserId);
	List<ZoneInfoDTO> findZonesByCampgroundId(Integer campgroundId);
	
	void registerSite(RegistSiteDTO dto);
	List<SiteInfoDTO> findSitesByCampgroundId(Integer campgroundId);
	RegistSiteDTO getSiteDetailsById(Integer siteId, Integer ownedCampgroundId);
    void updateSite(Integer siteId, RegistSiteDTO dto, Integer ownedCampgroundId);
    
    // ★ 비활성화 및 삭제 관련
    // 비활성화
    void deactivateZone(Integer zoneId, Integer ownedCampgroundId);
    void deactivateSite(Integer siteId, Integer ownedCampgroundId);
    void activateZone(Integer zoneId, Integer ownedCampgroundId);
    void activateSite(Integer siteId, Integer ownedCampgroundId);
    //영구삭제
    void deleteZone(Integer zoneId, Integer ownedCampgroundId); 
    void deleteSite(Integer siteId, Integer ownedCampgroundId);
}
