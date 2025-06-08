import React, { useState } from "react";
import SiteSelectionCard from "./CZ_SiteSelectionCard";
import { useNavigate } from "react-router-dom";

export default function CZ_SiteSelectionSection({ zoneSiteData, availableSiteIds, startDate, endDate, people }) {
    const navigate = useNavigate();
    
    const [selectedSiteId, setSelectedSiteId] = useState(null);
    if(!zoneSiteData || !zoneSiteData.sites) return null;
    const siteList = zoneSiteData.sites;

    // 날짜에 따른 가격 계산 함수 (성수기 고려)
    const calculatePrice = (startDate) => {
        if (!startDate || !zoneSiteData) return zoneSiteData.defaultWeekdayPrice || 0;
        
        // startDate가 "2025.06.10" 형식인 경우 "2025-06-10"으로 변환
        const dateStr = startDate.replace(/\./g, "-");
        const date = new Date(dateStr);
        const dayOfWeek = date.getDay(); // 0: 일요일, 6: 토요일
        
        // 주말(토요일=6, 일요일=0)인지 확인
        const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
        
        // 성수기 여부 확인
        if (zoneSiteData.isPeakSeason) {
            // 성수기인 경우: 성수기 가격 사용
            return isWeekend ? zoneSiteData.peakWeekendPrice : zoneSiteData.peakWeekdayPrice;
        } else {
            // 비성수기인 경우: 기본 가격 사용
            return isWeekend ? zoneSiteData.defaultWeekendPrice : zoneSiteData.defaultWeekdayPrice;
        }
    };

    // 사이트 선택 시 실행
    const handleSelect = (siteId, isAvailable) => {
        if(!isAvailable) return;    // 예약 불가일 경우 선택 불가
        setSelectedSiteId(siteId);
    };

    // 예약 페이지로 이동  * Todo: 주소 수정 필요
    const handleReserve = (selectedSiteId) => {
  if (!selectedSiteId) return;

  const checkinTime = startDate.replace(/\./g, "-") + "T16:00:00";
  const checkoutTime = endDate.replace(/\./g, "-") + "T11:00:00";
  
  // 체크인 날짜에 따른 가격 계산
  const campgroundPrice = calculatePrice(startDate);

  navigate(`/reservation`, {
    state: {
      siteId: selectedSiteId,
      zoneId: zoneSiteData.zoneId,
      campgroundId: zoneSiteData.campgroundId,
      startDate ,
      endDate ,
      people,
      checkinTime,
      checkoutTime,
      price: campgroundPrice, // 계산된 가격 사용
    },
  });
};

    return (
    <section className="w-full mt-8 select-none">
        <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold text-cblack">사이트 선택</h2>
        </div>
        <div className="grid grid-cols-7 place-items-center">
            {siteList.map((site) => (
                <SiteSelectionCard 
                    key = {site.siteId}
                    site = {{
                        ...site,
                        isAvailable: availableSiteIds.includes(String(site.siteId)),
                    }}
                    siteTerrainType = {zoneSiteData.zoneTerrainType}
                    isSelected = {selectedSiteId === site.siteId}
                    onSelect = {handleSelect}
                />
            ))}
        </div>
        <button
            type="button"
            disabled={!selectedSiteId}
            className="mt-8 w-full bg-cpurple text-white rounded-lg py-3 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick = {() => handleReserve(selectedSiteId)}
        >
        예약하기
        </button>
    </section>
  );
}
