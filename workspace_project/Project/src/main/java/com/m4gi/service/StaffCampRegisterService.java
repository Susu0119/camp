package com.m4gi.service;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;

public interface StaffCampRegisterService {

	RegistCampgroundDTO registerCampground(RegistCampgroundDTO dto);
	
	RegistZoneDTO registerZone(RegistZoneDTO dto);
	void registerPeakSeason(RegistPeakSeasonDTO dto);
	
	void registerSite(RegistSiteDTO dto);
}
