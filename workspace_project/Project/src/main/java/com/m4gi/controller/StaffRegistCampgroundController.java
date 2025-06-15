package com.m4gi.controller;

import java.util.Collections;
import java.util.List;

import javax.servlet.http.HttpSession;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.m4gi.dto.RegistCampgroundDTO;
import com.m4gi.dto.RegistPeakSeasonDTO;
import com.m4gi.dto.RegistSiteDTO;
import com.m4gi.dto.RegistZoneDTO;
import com.m4gi.dto.SiteInfoDTO;
import com.m4gi.dto.ZoneDetailDTO;
import com.m4gi.dto.ZoneInfoDTO;
import com.m4gi.service.StaffCampRegisterService;

import lombok.RequiredArgsConstructor;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/staff/register")
public class StaffRegistCampgroundController {
	
	private final StaffCampRegisterService staffCampRegisterService;
	
	// 세션에서 campgroundId를 가져오는 헬퍼 메소드
    private Integer getOwnedCampgroundIdFromSession(HttpSession session) {
        Integer providerCode = (Integer) session.getAttribute("providerCode");
        String providerUserId = (String) session.getAttribute("providerUserId");
        if (providerCode == null || providerUserId == null) {
            throw new IllegalArgumentException("로그인이 필요합니다.");
        }
        Integer ownedCampgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);
        if (ownedCampgroundId == null) {
            throw new IllegalArgumentException("소유한 캠핑장이 없습니다.");
        }
        return ownedCampgroundId;
    }
    
    // 한글 오류 메시지를 위한 헬퍼 메소드
    private ResponseEntity<String> createErrorResponse(HttpStatus status, String message) {
        HttpHeaders headers = new HttpHeaders();
        // 응답 헤더에 Content-Type과 UTF-8 인코딩을 명시적으로 설정
        headers.add("Content-Type", "text/plain;charset=UTF-8");
        return new ResponseEntity<>(message, headers, status);
    }
	
	// 캠핑장 등록
	@PostMapping("/campgrounds")
	public ResponseEntity<RegistCampgroundDTO> insertCampground(@RequestBody RegistCampgroundDTO dto, HttpSession session) {
		
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
			String providerUserId = (String) session.getAttribute("providerUserId");
			
			// 세션 정보가 없을 경우의 예외 처리
			if (providerCode == null || providerUserId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(null);
			}
			
			RegistCampgroundDTO createdCampground = staffCampRegisterService.registerCampground(dto, providerCode, providerUserId);
	        return ResponseEntity.ok(createdCampground);
		} catch (Exception e) {
			e.printStackTrace(); 
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
		}
	}
	
	@GetMapping("/my-campsite")
    public ResponseEntity<?> getMyCampsiteDetails(HttpSession session) {
        try {
            Integer providerCode = (Integer) session.getAttribute("providerCode");
            String providerUserId = (String) session.getAttribute("providerUserId");

            if (providerCode == null || providerUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }

            Integer campgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);

            if (campgroundId == null) {
                return ResponseEntity.ok(null);
            }

            RegistCampgroundDTO campsite = staffCampRegisterService.getCampsiteDetailsById(campgroundId);
            return ResponseEntity.ok(campsite);
        } catch (Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류");
        }
    }
	
	// 캠핑장 수정
	@PutMapping("/campgrounds")
	public ResponseEntity<?> updateCampground(@RequestBody RegistCampgroundDTO dto, HttpSession session) {
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
			String providerUserId = (String) session.getAttribute("providerUserId");
			
			if (providerCode == null || providerUserId == null) {
				return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
			}
			
			RegistCampgroundDTO updatedCampground = staffCampRegisterService.updateCampground(dto, providerCode, providerUserId);
			
			return ResponseEntity.ok(updatedCampground);
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("캠핑장 정보 수정 중 오류가 발생했습니다.");
		}
	}
	
	// 구역 등록
	@PostMapping("/zones")
	public ResponseEntity<?> insertZone(@RequestBody RegistZoneDTO dto) {
		try {
			RegistZoneDTO createdZone = staffCampRegisterService.registerZone(dto);
			return ResponseEntity.ok(createdZone);
		} catch (Exception e) {
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null); 
		}
	}
	
	// 구역 리스트 조회
	@GetMapping("/my-zones")
	public ResponseEntity<?> getMyZones(HttpSession session) {
	    try {
	        Integer providerCode = (Integer) session.getAttribute("providerCode");
	        String providerUserId = (String) session.getAttribute("providerUserId");

	        if (providerCode == null || providerUserId == null) {
	            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
	        }

	        // 사용자 ID를 이용해 소유한 캠핑장 ID를 DB에서 조회
	        Integer campgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);

	        if (campgroundId == null) {
	            // 소유한 캠핑장이 없는 경우, 빈 목록을 반환
	            return ResponseEntity.ok(Collections.emptyList());
	        }

	        // 조회된 campgroundId로 해당 캠핑장의 존 목록 조회
	        List<ZoneInfoDTO> zones = staffCampRegisterService.findZonesByCampgroundId(campgroundId);
	        return ResponseEntity.ok(zones);

	    } catch (Exception e) {
	        e.printStackTrace();
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
	    }
	}
	
	// 구역 상세 정보 조회
	@GetMapping("/zones/{zoneId}")
	public ResponseEntity<?> getZoneDetails(@PathVariable("zoneId") Integer zoneId, HttpSession session) {
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
	        String providerUserId = (String) session.getAttribute("providerUserId");
	        Integer ownedCampgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);
	        
	        ZoneDetailDTO zoneDetail = staffCampRegisterService.getZoneDetailsById(zoneId, ownedCampgroundId);
	        return ResponseEntity.ok(zoneDetail);	        
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("존 정보 조회 중 오류 발생");
		}
	}
	
	// 특정 구역 정보 수정
	@PutMapping("/zones/{zoneId}")
	public ResponseEntity<?> updateZone(@PathVariable("zoneId") Integer zoneId, @RequestBody RegistZoneDTO dto, HttpSession session) {
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
	        String providerUserId = (String) session.getAttribute("providerUserId");
	        Integer ownedCampgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);
	        
	        staffCampRegisterService.updateZone(zoneId, dto, ownedCampgroundId);
	        
	        return ResponseEntity.ok().build();
		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("존 정보 수정 중 오류 발생");
		}
	}
	
	// 존 비활성화
    @PatchMapping("/zones/{zoneId}/deactivate")
    public ResponseEntity<?> deactivateZone(@PathVariable("zoneId") Integer zoneId, HttpSession session) {
        try {
            Integer ownedCampgroundId = getOwnedCampgroundIdFromSession(session);
            staffCampRegisterService.deactivateZone(zoneId, ownedCampgroundId);
            return ResponseEntity.ok().body("존이 비활성화되었습니다.");
        } catch (IllegalStateException e) {
        	return createErrorResponse(HttpStatus.CONFLICT, e.getMessage());
        } catch (IllegalArgumentException e) {
        	return createErrorResponse(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
        	return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "오류가 발생했습니다.");
        }
    }

    // 사이트 비활성화
    @PatchMapping("/sites/{siteId}/deactivate")
    public ResponseEntity<?> deactivateSite(@PathVariable("siteId") Integer siteId, HttpSession session) {
        try {
            Integer ownedCampgroundId = getOwnedCampgroundIdFromSession(session);
            staffCampRegisterService.deactivateSite(siteId, ownedCampgroundId);
            return ResponseEntity.ok().body("사이트가 비활성화되었습니다.");
        } catch (IllegalStateException e) {
        	return createErrorResponse(HttpStatus.CONFLICT, e.getMessage());
        } catch (IllegalArgumentException e) {
        	return createErrorResponse(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
        	return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "오류가 발생했습니다.");
        }
    }
    
    // 존 활성화
    @PatchMapping("/zones/{zoneId}/activate")
    public ResponseEntity<?> activateZone(@PathVariable("zoneId") Integer zoneId, HttpSession session) {
        try {
            Integer ownedCampgroundId = getOwnedCampgroundIdFromSession(session);
            staffCampRegisterService.activateZone(zoneId, ownedCampgroundId);
            return ResponseEntity.ok().body("존이 활성화되었습니다.");
        } catch (IllegalArgumentException e) {
            // 소유권이 없거나, 로그인이 필요한 경우
        	return createErrorResponse(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            // 기타 서버 오류
            e.printStackTrace();
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "존 활성화 중 오류가 발생했습니다.");
        }
    }
    
    // 사이트 활성화
    @PatchMapping("/sites/{siteId}/activate")
    public ResponseEntity<?> activateSite(@PathVariable("siteId") Integer siteId, HttpSession session) {
        try {
            Integer ownedCampgroundId = getOwnedCampgroundIdFromSession(session);
            staffCampRegisterService.activateSite(siteId, ownedCampgroundId);
            return ResponseEntity.ok().body("사이트가 활성화되었습니다.");
        } catch (IllegalArgumentException e) {
            // 소유권이 없거나, 로그인이 필요한 경우
        	return createErrorResponse(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            // 기타 서버 오류
            e.printStackTrace();
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "사이트 활성화 중 오류가 발생했습니다.");
        }
    }
	
	// 구역 삭제
	@DeleteMapping("/zones/{zoneId}")
    public ResponseEntity<?> deleteZone(
    		@PathVariable("zoneId") Integer zoneId, HttpSession session) {
        
        try {
        	Integer ownedCampgroundId = getOwnedCampgroundIdFromSession(session);
            staffCampRegisterService.deleteZone(zoneId, ownedCampgroundId);
            return ResponseEntity.ok().build();

        } catch (IllegalStateException e) {
            return createErrorResponse(HttpStatus.CONFLICT, e.getMessage());
        } catch (IllegalArgumentException e) {
            return createErrorResponse(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "존 삭제 중 오류가 발생했습니다.");
        }
    }
	
	// 사이트 등록
	@PostMapping("/sites")
	public ResponseEntity<?> insertSite(@RequestBody RegistSiteDTO dto) {
	    try {
	        staffCampRegisterService.registerSite(dto);
	        return ResponseEntity.ok("사이트 등록 성공");
	    } catch (Exception e) {
	        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사이트 등록 실패: " + e.getMessage());
	    }
	}
	
	// 사이트 리스트 조회
	@GetMapping("/my-sites")
	public ResponseEntity<?> getMySites(HttpSession session) {
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
            String providerUserId = (String) session.getAttribute("providerUserId");
            
            if (providerCode == null || providerUserId == null) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
            }
            
            // 사용자 ID를 이용해 소유한 캠핑장 ID를 DB에서 조회
            Integer campgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);

            if (campgroundId == null) {
                // 소유한 캠핑장이 없는 경우, 빈 목록을 반환
                return ResponseEntity.ok(Collections.emptyList());
            }

            // 조회된 campgroundId로 해당 캠핑장의 사이트 목록 조회
            List<SiteInfoDTO> sites = staffCampRegisterService.findSitesByCampgroundId(campgroundId);
            System.out.println("조회된 사이트 목록 개수: " + sites.size());
            
            return ResponseEntity.ok(sites);
            
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("서버 오류가 발생했습니다.");
		}
	}
	
	// 특정 사이트 삭제
	@DeleteMapping("/sites/{siteId}")
    public ResponseEntity<?> deleteSite(
    		@PathVariable("siteId") Integer siteId, HttpSession session) {
        
        try {
        	Integer ownedCampgroundId = getOwnedCampgroundIdFromSession(session);
            
            // 서비스를 호출하여 사이트 삭제 로직 실행
            staffCampRegisterService.deleteSite(siteId, ownedCampgroundId);
            
            return ResponseEntity.ok().build(); // 성공 시 200 OK

        } catch (IllegalStateException e) {
            return createErrorResponse(HttpStatus.CONFLICT, e.getMessage());
        } catch (IllegalArgumentException e) {
            return createErrorResponse(HttpStatus.FORBIDDEN, e.getMessage());
        } catch (Exception e) {
            e.printStackTrace();
            return createErrorResponse(HttpStatus.INTERNAL_SERVER_ERROR, "사이트 삭제 중 오류가 발생했습니다.");
        }
    }
	
	// 특정 사이트 상세 정보 조회
	@GetMapping("/sites/{siteId}")
	public ResponseEntity<?> getSiteDetails(@PathVariable("siteId") Integer siteId, HttpSession session) {
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
			String providerUserId = (String) session.getAttribute("providerUserId");
			Integer ownedCampgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);

			RegistSiteDTO siteDetails = staffCampRegisterService.getSiteDetailsById(siteId, ownedCampgroundId);
			return ResponseEntity.ok(siteDetails);

		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사이트 정보 조회 중 오류 발생");
		}
	}
	
	// 특정 사이트 정보 수정
	@PutMapping("/sites/{siteId}")
	public ResponseEntity<?> updateSite(@PathVariable("siteId") Integer siteId, @RequestBody RegistSiteDTO dto, HttpSession session) {
		try {
			Integer providerCode = (Integer) session.getAttribute("providerCode");
			String providerUserId = (String) session.getAttribute("providerUserId");
			Integer ownedCampgroundId = staffCampRegisterService.getOwnedCampgroundId(providerCode, providerUserId);

			staffCampRegisterService.updateSite(siteId, dto, ownedCampgroundId);
			return ResponseEntity.ok().build();

		} catch (IllegalArgumentException e) {
			return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
		} catch (Exception e) {
			e.printStackTrace();
			return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("사이트 정보 수정 중 오류 발생");
		}
	}
	
	
	
}
