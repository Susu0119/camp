package com.m4gi.service.admin;

import com.m4gi.dto.admin.CampgroundDTO;
import com.m4gi.exception.NotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CampgroundService {

    private final List<CampgroundDTO> campgrounds = new ArrayList<>(List.of(
            new CampgroundDTO("CG001", "파인애플 캠핑장", "강원도 평창", "010-1234-5678", "09:00", "22:00", "14:00", "11:00"),
            new CampgroundDTO("CG002", "솔빛 캠핑장", "경기도 양평", "010-4321-1234", "08:00", "23:00", "15:00", "10:00")
    ));

    public List<CampgroundDTO> getAll() {
        return campgrounds;

    }

    public CampgroundDTO getById(String id) {
        return campgrounds.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElseThrow(() -> new NotFoundException("해당 캠핑장이 존재하지 않습니다."));

    }

    public void add(CampgroundDTO dto) {
        campgrounds.add(dto);
    }

    public boolean update(String id, CampgroundDTO updated) {
        for (int i=0; i<campgrounds.size(); i++) {
            if (campgrounds.get(i).getId().equals(id)) {
                campgrounds.set(i, updated);
                return true;
            }
        }

        return false;

    }

    public boolean delete(String id) {
        return campgrounds.removeIf(c -> c.getId().equals(id));
    }

    public boolean disableCampground(String id, boolean disable) {
        for (CampgroundDTO dto : campgrounds) {
            if (dto.getId().equals(id)) {
                dto.setStatus(disable ? "비활성화" : "운영중");
                return true;
            }
        }
        return false;
    }

}
