package com.m4gi.service;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;

public interface StaffCampRegisterService {

	void registerCampground(RegistCampgroundDTO dto);
	
	void registerZone(RegistZoneDTO dto);
	void registerPeakSeason(RegistPeakSeasonDTO dto);
	
	void registerSite(RegistSiteDTO dto);
}
