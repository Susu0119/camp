package com.m4gi.service;

import com.m4gi.dto.CampingChecklistRequestDTO;
import com.m4gi.dto.CampingChecklistResponseDTO;

public interface GeminiService {

    /**
     * 사용자의 캠핑 예약 정보와 조건을 기반으로 맞춤형 캠핑 준비물 리스트를 생성
     * 
     * @param request 캠핑 정보 및 조건
     * @return 생성된 캠핑 준비물 리스트
     */
    CampingChecklistResponseDTO generateCampingChecklist(CampingChecklistRequestDTO request);
}