package com.m4gi.controller.admin;

import com.m4gi.dto.admin.CampgroundDTO;
import com.m4gi.service.admin.CampgroundService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/admin/campgrounds")
public class CampdgroundController {

    private final CampgroundService service;

    public CampdgroundController(CampgroundService service) {
        this.service = service;
    }

    @GetMapping
    public List<CampgroundDTO> getAll() {
        return service.getAll();
    }

    @PostMapping
    public Map<String, String> create(@RequestBody CampgroundDTO dto) {
        service.add(dto);
        return Map.of("message", "등록완료");

    }

    @PatchMapping("/{id}/disable")
    public Map<String, String> disableCampground(@PathVariable String id, @RequestBody Map<String, Boolean> body) {
        boolean disable = body.get("disable");
        boolean result = service.disableCampground(id, disable);
        return Map.of("message", result ? (disable ? "비활성화 완료" : "운영 상태로 복구") : "해당 캠핑장 없음");
    }

    @GetMapping("/{id}")
    public ResponseEntity<CampgroundDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }


}
