package com.m4gi.controller.admin;

import com.m4gi.service.NaverMapService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api")
public class NaverMapController {

    @Autowired
    private NaverMapService naverMapService;

    @RequestMapping(value = "/directions", method = RequestMethod.GET)
    public ResponseEntity<String> getDirections(
            @RequestParam("start") String start,
            @RequestParam("goal") String goal) {

        try {
            String result = naverMapService.getDirections(start, goal);

            HttpHeaders headers = new HttpHeaders();
            headers.add("Content-Type", "application/json;charset=UTF-8");
            headers.add("Access-Control-Allow-Origin", "*");
            headers.add("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
            headers.add("Access-Control-Allow-Headers", "Content-Type");

            return new ResponseEntity<>(result, headers, HttpStatus.OK);

        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<>("{\"error\":\"" + e.getMessage() + "\"}",
                    HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}