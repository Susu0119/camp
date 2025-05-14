package com.m4gi.service.admin;

import com.m4gi.dto.admin.CampgroundDTO;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CampgroundService {

    private final List<CampgroundDTO> campgrounds = new ArrayList<>(List.of(
            new CampgroundDTO("CG001", "파인애플 캠핑장", "강원도 평창", "조용하고 깨끗한 자연친화 캠핑장"),
            new CampgroundDTO("CG002", "솔빛 캠핑장", "경기도 양평", "계곡 옆 캠핑장")

    ));

    public List<CampgroundDTO> getAll() {
        return campgrounds;

    }

    public CampgroundDTO getById(String id) {
        return campgrounds.stream()
                .filter(c -> c.getId().equals(id))
                .findFirst()
                .orElse(null);

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
