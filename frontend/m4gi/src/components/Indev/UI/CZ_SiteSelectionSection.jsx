import React, { useState } from "react";
import SiteSelectionCard from "./CZ_SiteSelectionCard";
import { useNavigate } from "react-router-dom";

export default function CZ_SiteSelectionSection({ zoneSiteData, availableSiteIds, startDate, endDate, people }) {
    const navigate = useNavigate();
    
    const [selectedSiteId, setSelectedSiteId] = useState(null);
    if(!zoneSiteData || !zoneSiteData.sites) return null;
    const siteList = zoneSiteData.sites;

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

  navigate(`/reservation`, {
    state: {
      siteId: selectedSiteId,
      zoneId: zoneSiteData.zoneId,
      campgroundId: "CAMP_0001", //zoneSiteData.campgroundId,
      startDate ,
      endDate ,
      people,
      checkinTime,
      checkoutTime,
      price: zoneSiteData.pricePerNight || 100000, // 또는 계산된 가격
    },
  });
};

    
    return (
    <section className="w-full mt-8 select-none">
        <h2 className="text-2xl font-bold text-cblack mb-4">사이트 선택</h2>
        <div className="grid grid-cols-7 place-items-center">
            {siteList.map((site) => (
                <SiteSelectionCard 
                    key = {site.siteId}
                    site = {{
                        ...site,
                        isAvailable: availableSiteIds.includes(site.siteId),
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
