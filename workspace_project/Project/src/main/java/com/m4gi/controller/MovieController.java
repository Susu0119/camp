package com.m4gi.controller;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/movies")
public class MovieController {
    private static final Logger logger = LoggerFactory.getLogger(MovieController.class);

    // ① @Value 로 application.properties 에서 직접 주입
    @Value("${tmdb.api.key}")
    private String apiKey;

    // ② @Autowired 로 RestTemplate 주입
    @Autowired
    private RestTemplate restTemplate;

    @GetMapping("/now-playing")
    public List<MovieDto> nowPlaying() {
        logger.debug(">>> tmdb.api.key = [{}]", apiKey);

        String url = String.format(
                "https://api.themoviedb.org/3/movie/now_playing?api_key=%s&language=ko-KR&region=KR&page=1",
                apiKey
        );
        logger.debug(">>> Request URL: {}", url);

        Map<?,?> resp = restTemplate.getForObject(url, Map.class);
        @SuppressWarnings("unchecked")
        List<Map<String,Object>> results = (List<Map<String,Object>>)resp.get("results");

        return results.stream()
                .limit(25)
                .map(m -> new MovieDto(
                        (String)m.get("title"),
                        (String)m.get("poster_path")
                ))
                .collect(Collectors.toList());
    }

    @Getter @AllArgsConstructor
    public static class MovieDto {
        private final String title;
        private final String posterPath;
    }
}
