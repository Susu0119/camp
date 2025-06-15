package com.m4gi.dto;

import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class DailyReservationStatusDTO {
	// 입실 대상 목록
    private List<StaffReservationDTO> checkInList;
    
    // 퇴실 대상 목록
    private List<StaffReservationDTO> checkOutList;
}
