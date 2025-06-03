package com.m4gi.service.admin;

import com.m4gi.dto.admin.AdminCampgroundDTO;
import com.m4gi.dto.admin.AdminCampgroundDetailDTO;
import com.m4gi.exception.NotFoundException;
import com.m4gi.mapper.admin.AdminCampgroundMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AdminCampgroundService {

    private final AdminCampgroundMapper mapper;

    // 전체 조회
    public List<AdminCampgroundDTO> getAll() {
        return mapper.findAll();
    }

    // 단건 조회
    public AdminCampgroundDTO getById(String id) {
        AdminCampgroundDTO dto = mapper.findById(id);
        if (dto == null) {
            throw new NotFoundException(("해당 캠핑장이 존재하지 않습니다."));
        }
        return dto;
    }

    // 등록
    public void add(AdminCampgroundDTO dto) {
        mapper.insert(dto);
    }

    // 상태 변경 (비활성화 or 복구)
    public boolean disableCampground(String id, boolean disable) {
        int status = disable ? 2 : 0; // 2 = 비활성화, 0 = 운영중
        mapper.updateStatus(id, status);
        return true;
    }

    public AdminCampgroundDetailDTO getDetailById(String id) {
        AdminCampgroundDetailDTO dto = mapper.findCampgroundDetailById(id);
        if (dto == null) {
            throw new NotFoundException("해당 캠핑장 상세정보를 찾을 수 없습니다.");
        }
        return dto;
    }

    public List<AdminCampgroundDTO> searchCampgrounds(Map<String, Object> params) {
        return mapper.search(params);
    }

}
