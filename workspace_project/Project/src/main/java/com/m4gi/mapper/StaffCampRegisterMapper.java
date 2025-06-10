package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.dto.SiteInfoDTO;
import com.m4gi.dto.ZoneInfoDTO;

@Mapper
public interface StaffCampRegisterMapper {
	// 캠핑장 등록 관련
	void insertCampground(RegistCampgroundDTO campgroundDTO);
	Integer selectMaxCampgroundId();
	int existsCampgroundId(Integer id);
	void updateOwnedCampgroundId(
		@Param("providerCode") Integer providerCode,
        @Param("providerUserId") String providerUserId,
        @Param("campgroundId") Integer campgroundId
    );
	
	// 캠핑장 조회
	RegistCampgroundDTO findCampsiteById(Integer campgroundId);
	
	// 캠핑장 수정
	int updateCampground(RegistCampgroundDTO dto);
	
	// 구역 등록 관련
	void insertZone(RegistZoneDTO zoneDTO);
	Integer selectMaxZoneIdByCampgroundId(Integer campgroundId);
	int existsZoneId(Integer zoneId);
	
	// 구역 등록 관련 - 성수기 가격 등록
	void insertPeakSeason(RegistPeakSeasonDTO dto);
	
	// 구역 조회 관련 
	Integer findOwnedCampgroundIdByUserId(
        @Param("providerCode") Integer providerCode,
        @Param("providerUserId") String providerUserId
    );
	List<ZoneInfoDTO> findZonesByCampgroundId(Integer campgroundId);
	
	// 구역 삭제
	int deleteZoneById(
        @Param("zoneId") Integer zoneId, 
        @Param("ownedCampgroundId") Integer ownedCampgroundId
    );
	
	// 사이트 등록 관련
	void insertSite(RegistSiteDTO dto);
    Integer selectMaxSiteIdByZoneId(int zoneId);
    Integer selectZoneCapacityByZoneId(int zoneId);
	
    // 사이트 조회
    List<SiteInfoDTO> findSitesByCampgroundId (Integer campgroundId);
    
    // 사이트 삭제
    int deleteSiteById(
        @Param("siteId") Integer siteId,
        @Param("ownedCampgroundId") Integer ownedCampgroundId
    );
    
    // 모든 사이트 삭제 (삭제할 존 하위의 모든 캠핑장)
    int deleteSitesByZoneId(Integer zoneId);
}
