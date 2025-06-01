"use client";
import React from "react";

export default function CZCampZoneInfo( { zoneSiteData } ) {

    // 캠핑 유형 영어 -> 한글 변환
    const translateZoneType = (type) => {
        const map = {
            tent: "캠핑",
            glamping: "글램핑",
            auto: "오토캠핑",
            caravan: "카라반",
            campnic: "캠프닉"
        };
        return map[type] || type;        
    };

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
        <section className="w-full">
            <div className="flex flex-wrap gap-3 justify-between items-center w-full">
                <h2 className="self-stretch my-auto text-2xl font-bold text-cblack">
                    { zoneSiteData?.zoneName }
                </h2>
            </div>

            {/* 캠핑 유형, 지형 유형, 인원수 박스 */}
            <div className="w-full bg-clpurple rounded-md p-6 flex justify-around items-center text-center mt-4">
                <div>
                    <div className="text-cpurple mb-1">캠핑 유형</div>
                    <div className="text-cblack">{ translateZoneType(zoneSiteData?.zoneType) }</div>
                </div>
                <div>
                    <div className="text-cpurple mb-1">지형 유형</div>
                    <div className="text-cblack">{ translateTerrainType(zoneSiteData?.zoneTerrainType) }</div>
                </div>
                <div>
                    <div className="text-cpurple mb-1">최대 인원수</div>
                    <div className="text-cblack">{ zoneSiteData?.capacity } 명</div>
                </div>
            </div>
        </section>
    );
}
