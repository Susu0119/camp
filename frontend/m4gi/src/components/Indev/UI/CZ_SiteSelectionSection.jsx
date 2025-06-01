import React, { useState } from "react";
import SiteSelectionCard from "./CZ_SiteSelectionCard";

export default function CZ_SiteSelectionSection({ zoneSiteData }) {
    const [selectedSiteId, setSelectedSiteId] = useState(null);
    if(!zoneSiteData || !zoneSiteData.sites) return null;
    const siteList = zoneSiteData.sites;

    const handleSelect = (siteId, isAvailable) => {
        if(!isAvailable) return;    // 예약 불가일 경우 선택 불가
        setSelectedSiteId(siteId);
    };

    return (
    <section className="w-full mt-8">
        <h2 className="text-2xl font-bold text-cblack mb-4">사이트 선택</h2>
        <div className="grid grid-cols-7 place-items-center">
            {siteList.map((site) => (
                <SiteSelectionCard 
                    key = {site.siteId}
                    site = {site}
                    siteTerrainType = {zoneSiteData.zoneTerrainType}
                    isSelected = {selectedSiteId === site.siteId}
                    onSelect = {handleSelect}
                />
            ))}
        </div>
        <button
            disabled={!selectedSiteId}
            className="mt-8 w-full bg-cpurple text-white rounded-lg py-3 text-center cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={() => alert(`예약 진행: ${selectedSiteId}`)}   // TODO : 임시 코드, 수정 필요
        >
        예약하기
        </button>
    </section>
  );
}
