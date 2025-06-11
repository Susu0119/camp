package com.m4gi.dto;

import lombok.Data;
import lombok.Builder;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDate;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class WeatherDTO {
    private LocalDate date;
    private double temperature; // 평균 온도
    private double temperatureMin; // 최저 온도
    private double temperatureMax; // 최고 온도
    private String weatherMain; // 날씨 상태 (Clear, Rain, Snow 등)
    private String weatherDescription; // 날씨 상세 설명
    private double humidity; // 습도
    private double windSpeed; // 풍속
    private double rainProbability; // 강수 확률 (%)
}