package com.m4gi.controller.admin;

import com.m4gi.dto.admin.AdminCampgroundDTO;
import com.m4gi.dto.admin.AdminCampgroundDetailDTO;
import com.m4gi.service.admin.AdminCampgroundService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@RestController
@RequestMapping("/admin/campgrounds")
public class AdminCampgroundController {

    private final AdminCampgroundService service;

    @GetMapping
    public List<AdminCampgroundDTO> getAll() {
        return service.getAll();
    }

//    @PostMapping
//    public Map<String, String> create(@RequestBody CampgroundDTO dto) {
//        service.add(dto);
//        return Map.of("message", "등록완료");
//
//    }

    @PatchMapping("/{id}/disable")
    public ResponseEntity<Map<String, String>> disableCampground(
            @PathVariable String id,
            @RequestBody Map<String, Boolean> body
    ) {
        boolean disable = body.getOrDefault("disable", false);
        service.disableCampground(id, disable); // ✅ 메서드명과 boolean 맞춤

        Map<String, String> result = new HashMap<>();
        result.put("message", disable ? "비활성화 완료" : "복구 완료");
        result.put("updatedStatus", disable ? "비활성화" : "운영중");

        return ResponseEntity.ok(result);
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminCampgroundDTO> getById(@PathVariable String id) {
        return ResponseEntity.ok(service.getById(id));
    }

    @GetMapping("/{id}/detail")
    public ResponseEntity<AdminCampgroundDetailDTO> getDetail(@PathVariable String id) {
        return ResponseEntity.ok(service.getDetailById(id));
    }

    @GetMapping("/search")
    public List<AdminCampgroundDTO> search(@RequestParam Map<String, Object> params) {
        return service.searchCampgrounds(params);
    }


}
