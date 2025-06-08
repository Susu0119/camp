import React from "react";

export default function SiteSelectionCard({ site, siteTerrainType, isSelected, onSelect }) {
    const isUnavailable = !site.isActive || !site.isAvailable;
    console.log("🟡 카드 표시 상태:", site.siteId, "isActive:", site.isActive, "isAvailable:", site.isAvailable, "→ 회색?", isUnavailable);
    
    // 사이트 예약 가능 여부, 사이트 선택에 따른 텍스트 색상 설정
    const textColor = isUnavailable ? "text-gray-400" : isSelected ? "text-cpurple" : "text-cblack";
    
    // 지형 유형 영어 -> 한글 변환
    const translateTerrainType = (type) => {
        const map = {
            Grass: "잔디/흙",
            Deck: "데크",
            Gravel: "자갈/파쇄석",
            Sand: "모래",
            Mixed: "혼합",
            Other: "기타"
        };
        return map[type] || type;
    };

    return (
        <div
            key = {site.siteId}
            onClick = {() => onSelect(site.siteId, site.isActive && site.isAvailable)}
            className = {`
                w-50 border border-cgray rounded-xl px-6 py-7 
                flex flex-col items-center justify-center cursor-pointer                
                ${isSelected ? 'bg-clpurple text-cpurple border-clpurple' : ''}
                ${isUnavailable ? 'opacity-30 cursor-not-allowed' : 'hover:shadow-md'}
            `}
        >
            <p className = {`mb-6 ${textColor}`}>{site.siteName}</p>
            <p className = {`flex gap-3 items-center text-sm mb-2 ${textColor}`} >
                {translateTerrainType(siteTerrainType)}
            </p>
            <p className = {`flex gap-3 items-center text-sm mb-2 ${textColor}`} >
                <span className = "flex items-center">
                    {site.widthMeters} x {site.heightMeters} m
                </span>
            </p>
            <p className = {`flex gap-3 items-center text-sm mb-2 ${textColor}`} >
                <span className = "flex items-center">최대 {site.capacity}명</span>
            </p>
        </div>
    );
}
