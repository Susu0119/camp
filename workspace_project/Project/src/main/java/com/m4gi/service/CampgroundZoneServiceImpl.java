package com.m4gi.service;

import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.m4gi.dto.CampgroundSiteDTO;
import com.m4gi.dto.CampgroundZoneDetailDTO;
import com.m4gi.dto.ReviewDTO;
import com.m4gi.mapper.CampgroundZoneMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class CampgroundZoneServiceImpl implements CampgroundZoneService {

	private final CampgroundZoneMapper campgroundZoneMapper;

	// 캠핑장 구역 상세 페이지 - 구역 및 사이트 정보 가져오기
	@Override
	public CampgroundZoneDetailDTO getZoneDetail(int campgroundId, int zoneId) {
		Map<String, Object> params = new HashMap<>();
		params.put("campgroundId", campgroundId);
		params.put("zoneId", zoneId);

		CampgroundZoneDetailDTO zoneDetail = campgroundZoneMapper.selectZoneDetailByZoneId(params);
		if (zoneDetail == null) {
			return null;
		}

		List<CampgroundSiteDTO> sites = campgroundZoneMapper.selectSitesDetailByZoneId(zoneId);
		zoneDetail.setSites(sites);

		List<ReviewDTO> reviews = campgroundZoneMapper.selectReviewsByZoneId(zoneId);
		zoneDetail.setReviews(reviews);

		return zoneDetail;
	}

	// 캠핑장 구역 상세 페이지 - 예약 가능한 사이트 가져오기
	@Override
	public List<String> getAvailableSitesByZoneId(int zoneId, String startDate, String endDate) {
		Map<String, Object> params = new HashMap<>();
		params.put("zoneId", zoneId);
		params.put("startDate", LocalDate.parse(startDate));
		params.put("endDate", LocalDate.parse(endDate));

		return campgroundZoneMapper.selectAvailableSitesByZoneId(params);
	}

	// 특정 날짜에 따른 구역 가격 계산
	@Override
	public Integer calculateZonePrice(int zoneId, String date) {
		// 구역 정보 조회 (임시로 campgroundId 0 사용)
		Map<String, Object> params = new HashMap<>();
		params.put("campgroundId", 0); // 실제로는 매개변수로 받아야 함
		params.put("zoneId", zoneId);

		CampgroundZoneDetailDTO zoneDetail = campgroundZoneMapper.selectZoneDetailByZoneId(params);
		if (zoneDetail == null) {
			return null;
		}

		// 날짜 파싱 및 요일 확인
		LocalDate localDate = LocalDate.parse(date);
		DayOfWeek dayOfWeek = localDate.getDayOfWeek();

		// 주말(토요일, 일요일)인지 확인
		boolean isWeekend = dayOfWeek == DayOfWeek.SATURDAY || dayOfWeek == DayOfWeek.SUNDAY;

		return isWeekend ? zoneDetail.getDefaultWeekendPrice() : zoneDetail.getDefaultWeekdayPrice();
	}

	// 성수기 여부 확인 및 가격 계산
	@Override
	public CampgroundZoneDetailDTO getZoneDetailWithPeakSeason(int campgroundId, int zoneId, String date) {
		// 기본 구역 정보 조회
		CampgroundZoneDetailDTO zoneDetail = getZoneDetail(campgroundId, zoneId);
		if (zoneDetail == null) {
			return null;
		}

		// 성수기 가격 조회
		Map<String, Object> peakParams = new HashMap<>();
		peakParams.put("zoneId", zoneId);
		peakParams.put("date", LocalDate.parse(date));

		Map<String, Object> peakInfo = campgroundZoneMapper.selectPeakSeasonPrice(peakParams);

		if (peakInfo != null && !peakInfo.isEmpty()) {
			// 성수기인 경우
			zoneDetail.setPeakSeason(true);
			// Long을 Integer로 안전하게 변환
			Object weekdayPrice = peakInfo.get("peak_weekday_price");
			Object weekendPrice = peakInfo.get("peak_weekend_price");

			zoneDetail.setPeakWeekdayPrice(weekdayPrice != null ? ((Number) weekdayPrice).intValue() : null);
			zoneDetail.setPeakWeekendPrice(weekendPrice != null ? ((Number) weekendPrice).intValue() : null);
		} else {
			// 비성수기인 경우
			zoneDetail.setPeakSeason(false);
			zoneDetail.setPeakWeekdayPrice(null);
			zoneDetail.setPeakWeekendPrice(null);
		}

		return zoneDetail;
	}

}
