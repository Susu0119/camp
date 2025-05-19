package com.m4gi.service.admin;

import com.m4gi.dto.admin.CampgroundDTO;
import com.m4gi.exception.NotFoundException;
import com.m4gi.mapper.admin.CampgroundMapper;
import lombok.RequiredArgsConstructor;
import org.apache.ibatis.annotations.Mapper;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class CampgroundService {

    private final CampgroundMapper mapper;

    // 전체 조회
    public List<CampgroundDTO> getAll() {
        return mapper.findAll();
    }

    // 단건 조회
    public CampgroundDTO getById(String id) {
        CampgroundDTO dto = mapper.findById(id);
        if (dto == null) {
            throw new NotFoundException(("해당 캠핑장이 존재하지 않습니다."));
        }
        return dto;
    }

    // 등록
    public void add(CampgroundDTO dto) {
        mapper.insert(dto);
    }

    // 상태 변경 (비활성화 or 복구)
    public boolean disableCampground(String id, boolean disable) {
        int status = disable ? 2 : 0; // 2 = 비활성화, 0 = 운영중
        mapper.updateStatus(id, status);
        return true;
    }

}
