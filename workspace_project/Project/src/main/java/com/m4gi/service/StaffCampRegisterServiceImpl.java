package com.m4gi.service;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.dto.SiteInfoDTO;
import com.m4gi.dto.ZoneDetailDTO;
import com.m4gi.dto.ZoneInfoDTO;
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
    
    // ★ 등록 ----------------------------------------
	
	@Override
	public RegistCampgroundDTO registerCampground(RegistCampgroundDTO dto, Integer providerCode, String providerUserId) {
		// ID 수동 할당
		if (dto.getCampgroundId() == null) {
	        dto.setCampgroundId(getNextCampgroundId());
	    }		
		
		dto.setAddrSido(extractSido(dto.getAddrFull()));
	    dto.setAddrSigungu(extractSigungu(dto.getAddrFull()));

	    staffCampRegisterMapper.insertCampground(dto);
	    
	    staffCampRegisterMapper.updateOwnedCampgroundId(
            providerCode,
            providerUserId,
            dto.getCampgroundId()
        );
	    
	    return dto;
	}
	
	@Override
    public RegistZoneDTO registerZone(RegistZoneDTO dto) {
		// ID 수동 할당
        if (dto.getZoneId() == null) {
            dto.setZoneId(getNextZoneId(dto.getCampgroundId()));
        }
        
        // ID 중복 체크
        if (staffCampRegisterMapper.existsZoneId(dto.getZoneId()) > 0) {
            throw new IllegalArgumentException("이미 사용 중인 zoneId입니다: " + dto.getZoneId());
        }
        
        staffCampRegisterMapper.insertZone(dto);
        
        return dto;
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
	
	// ★ 조회 ----------------------------------------

	// 소유하고 있는 캠핑장 아이디 조회
	public Integer getOwnedCampgroundId(Integer providerCode, String providerUserId) {
		return staffCampRegisterMapper.findOwnedCampgroundIdByUserId(providerCode, providerUserId);
	}
	
	// 캠핑장 조회
	@Override
	public RegistCampgroundDTO getCampsiteDetailsById(Integer campgroundId) {
		return staffCampRegisterMapper.findCampsiteById(campgroundId);
	}
	
	// 구역 리스트 조회
	@Override
	public List<ZoneInfoDTO> findZonesByCampgroundId(Integer campgroundId) {
		return staffCampRegisterMapper.findZonesByCampgroundId(campgroundId);
	}
	
	
	// 사이트 리스트 조회
	@Override
	public List<SiteInfoDTO> findSitesByCampgroundId(Integer campgroundId) {
		return staffCampRegisterMapper.findSitesByCampgroundId(campgroundId);
	}
	
	// ★ 삭제 ----------------------------------------
	
	// 존 삭제
	@Override
	@Transactional
	public void deleteZone(Integer zoneId, Integer ownedCampgroundId) {
		staffCampRegisterMapper.deleteSitesByZoneId(zoneId);
		
		int deletedRows = staffCampRegisterMapper.deleteZoneById(zoneId, ownedCampgroundId);
		
		if (deletedRows == 0) {
            throw new IllegalArgumentException("존을 삭제할 수 없거나 권한이 없습니다.");
        }
	}
	
	// 사이트 삭제
	@Override
    @Transactional
    public void deleteSite(Integer siteId, Integer ownedCampgroundId) {
        int deletedRows = staffCampRegisterMapper.deleteSiteById(siteId, ownedCampgroundId);
        
        // 삭제된 행이 0개라면, 내 캠핑장의 사이트가 아니거나 이미 삭제된 경우
        if (deletedRows == 0) {
            throw new IllegalArgumentException("사이트를 삭제할 수 없거나 권한이 없습니다.");
        }
    }
	
	// ★ 수정 ----------------------------------------
	
	// 캠핑장 수정
	@Override
	@Transactional
	public RegistCampgroundDTO updateCampground(RegistCampgroundDTO dto, Integer providerCode, String providerUserId) {
		Integer campgroundIdToUpdate = dto.getCampgroundId();
		if (campgroundIdToUpdate == null) {
			throw new IllegalArgumentException("캠핑장 ID가 필요합니다.");
		}
		
		Integer ownedCampgroundId = staffCampRegisterMapper.findOwnedCampgroundIdByUserId(providerCode, providerUserId);
		
		if (ownedCampgroundId == null || !ownedCampgroundId.equals(campgroundIdToUpdate)) {
			throw new IllegalArgumentException("캠핑장을 수정할 권한이 없습니다.");
		}
		
		String[] addressParts = dto.getAddrFull().split(" ");
		if(addressParts.length >= 2) {
			dto.setAddrSido(addressParts[0]);
			dto.setAddrSigungu(addressParts[1]);
		}
		
		int updatedRows = staffCampRegisterMapper.updateCampground(dto);
		
		if (updatedRows == 0) {
			throw new RuntimeException("캠핑장 정보 업데이트에 실패하였습니다.");
		}
		
		return staffCampRegisterMapper.findCampsiteById(campgroundIdToUpdate);
	}
	
	// 특정 구역 상세 정보 조회
	@Override
	public ZoneDetailDTO getZoneDetailsById(Integer zoneId, Integer ownedCampgroundId) {
		Map<String, Integer> params = new HashMap<>();
		params.put("zoneId", zoneId);
		params.put("ownedCampgroundId", ownedCampgroundId);
		if(staffCampRegisterMapper.checkZoneOwnership(params) == 0) {
			throw new IllegalArgumentException("해당 존에 접근할 권한이 없습니다.");
		}
		return staffCampRegisterMapper.findZoneDetailsById(zoneId);
	}
	
	// 특정 구역 정보 수정
	@Override
	@Transactional
	public void updateZone(Integer zoneId, RegistZoneDTO dto, Integer ownedCampgroundId) {
		Map<String, Integer> params = new HashMap<>();
		params.put("zoneId", zoneId);
		params.put("ownedCampgroundId", ownedCampgroundId);
		if (staffCampRegisterMapper.checkZoneOwnership(params) == 0) {
			throw new IllegalArgumentException("해당 존을 수정할 권한이 없습니다.");
		}
		
		dto.setZoneId(zoneId);
		staffCampRegisterMapper.updateZone(dto);
		
		staffCampRegisterMapper.deletePeakSeasonsByZoneId(zoneId);
		
		if (dto.getPeakStartDate() != null && dto.getPeakEndDate() != null && dto.getPeakWeekdayPrice() != null) {
			staffCampRegisterMapper.insertPeakSeasonFromZoneDTO(dto);
		}
	}
	
	// 사이트 상세 정보 조회
	@Override
    public RegistSiteDTO getSiteDetailsById(Integer siteId, Integer ownedCampgroundId) {
        Map<String, Integer> params = new HashMap<>();
        params.put("siteId", siteId);
        params.put("ownedCampgroundId", ownedCampgroundId);
        if (staffCampRegisterMapper.checkSiteOwnership(params) == 0) {
            throw new IllegalArgumentException("해당 사이트에 접근할 권한이 없습니다.");
        }
        
        return staffCampRegisterMapper.findSiteById(siteId);
    }
	
	// 사이트 상세 정보 수정
	@Override
    @Transactional
    public void updateSite(Integer siteId, RegistSiteDTO dto, Integer ownedCampgroundId) {
        Map<String, Integer> params = new HashMap<>();
        params.put("siteId", siteId);
        params.put("ownedCampgroundId", ownedCampgroundId);
        if (staffCampRegisterMapper.checkSiteOwnership(params) == 0) {
            throw new IllegalArgumentException("해당 사이트를 수정할 권한이 없습니다.");
        }
        
        Integer zoneCapacity = staffCampRegisterMapper.selectZoneCapacityByZoneId(dto.getZoneId());
        if (zoneCapacity == null) {
            throw new IllegalArgumentException("선택된 존의 수용 인원 정보를 찾을 수 없습니다.");
        }
        dto.setCapacity(zoneCapacity);

        dto.setSiteId(siteId);
        
        int updatedRows = staffCampRegisterMapper.updateSite(dto);
        if (updatedRows == 0) {
            throw new RuntimeException("사이트 정보 업데이트에 실패했습니다.");
        }
    }
}
