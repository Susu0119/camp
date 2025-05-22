package com.m4gi.mapper;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import com.m4gi.dto.UserMypageReservationsDTO;

@Mapper
public interface UserMypageReservationsMapper {
	
	//예약 중인 목록 조회 (로그인 사용자 기준) 
	List<UserMypageReservationsDTO>  selectOngoingReservations(
			@Param("providerCode") int providerCode,
            @Param("providerUserId") String providerUserId);
}