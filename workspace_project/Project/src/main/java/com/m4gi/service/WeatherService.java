package com.m4gi.service;

import java.time.LocalDate;
import java.util.List;

import com.m4gi.dto.WeatherDTO;

public interface WeatherService {
    /**
     * 특정 위치의 날씨 정보를 가져옵니다.
     * 
     * @param latitude  위도
     * @param longitude 경도
     * @param startDate 시작 날짜
     * @param endDate   종료 날짜
     * @return 기간 동안의 날씨 정보 리스트
     */
    List<WeatherDTO> getWeatherForPeriod(double latitude, double longitude, LocalDate startDate, LocalDate endDate);

    /**
     * 주소를 기반으로 날씨 정보를 가져옵니다.
     * 
     * @param address   주소
     * @param startDate 시작 날짜
     * @param endDate   종료 날짜
     * @return 기간 동안의 날씨 정보 리스트
     */
    List<WeatherDTO> getWeatherByAddress(String address, LocalDate startDate, LocalDate endDate);
}