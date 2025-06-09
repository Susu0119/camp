package com.m4gi.service;

import org.springframework.stereotype.Service;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.mapper.CampgroundMapper;
import com.m4gi.mapper.StaffCampRegisterMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StaffCampRegisterServiceImpl implements StaffCampRegisterService {
	
	private final StaffCampRegisterMapper staffCampRegisterMapper;
	
	// 주소에서 시/도 추출
	private String extractSido(String fullAddr) {
        if (fullAddr == null) return "";
        String[] parts = fullAddr.split(" ");
        return parts.length > 0 ? parts[0] : "";
    }
	
	// 주소에서 시/군/구 추출
    private String extractSigungu(String fullAddr) {
        if (fullAddr == null) return "";
        String[] parts = fullAddr.split(" ");
        return parts.length > 1 ? parts[1] : "";
    }
    
    // 캠핑장 ID 생성 (예시: 100, 101, 102 ...)
    public Integer getNextCampgroundId() {
        Integer maxId = staffCampRegisterMapper.selectMaxCampgroundId(); // SELECT MAX(campground_id)
        return (maxId != null) ? maxId + 1 : 100; // 최초 생성은 100부터 시작
    }
    
    // 구역 ID 생성 (예시: 1001, 1002 ...)
    public Integer getNextZoneId(Integer campgroundId) {
    	Integer maxZoneId = staffCampRegisterMapper.selectMaxZoneIdByCampgroundId(campgroundId);
    	if (maxZoneId == null) {
    		return campgroundId * 10 + 1;
    	}
    	return maxZoneId + 1;
    }
	
	@Override
	public void registerCampground(RegistCampgroundDTO dto) {
		// ID 수동 할당
		if (dto.getCampgroundId() == null) {
	        dto.setCampgroundId(getNextCampgroundId());
	    }		
		
		dto.setAddrSido(extractSido(dto.getAddrFull()));
	    dto.setAddrSigungu(extractSigungu(dto.getAddrFull()));

	    staffCampRegisterMapper.insertCampground(dto);
	}
	
	@Override
    public void registerZone(RegistZoneDTO dto) {
		// ID 수동 할당
        if (dto.getZoneId() == null) {
            dto.setZoneId(getNextZoneId(dto.getCampgroundId()));
        }
        
        // ID 중복 체크
        if (staffCampRegisterMapper.existsZoneId(dto.getZoneId()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 zoneId입니다: " + dto.getZoneId());
        }
        
        staffCampRegisterMapper.insertZone(dto);
    }
	
	@Override
	public void registerSite(RegistSiteDTO dto) {
	    // 현재 zone의 capacity 조회 (그대로 site의 capacity에 넣기 위함. 추후 사이트별로 인원을 관리하게 된다면, 삭제 예정)
	    Integer zoneCapacity = staffCampRegisterMapper.selectZoneCapacityByZoneId(dto.getZoneId());
	    if (zoneCapacity == null) {
	        throw new IllegalArgumentException("존의 수용 인원을 찾을 수 없습니다.");
	    }

	    // 사이트 ID 생성
	    Integer maxSiteId = staffCampRegisterMapper.selectMaxSiteIdByZoneId(dto.getZoneId());
	    int nextSiteId = (maxSiteId != null) ? maxSiteId + 1 : dto.getZoneId() * 10 + 1;
	    
	    // 값 설정
	    dto.setSiteId(nextSiteId);
	    dto.setCapacity(zoneCapacity);
	    dto.setCurrentStock(1);

	    // DB 등록
	    staffCampRegisterMapper.insertSite(dto);
	}

	public void registerPeakSeason(RegistPeakSeasonDTO dto) {
	    staffCampRegisterMapper.insertPeakSeason(dto);
	}
	
	
}
