"use client";
import React, { useState } from "react";

function AmenityIcon({ iconSrc, label }) {
    return (
        <div className="flex justify-between items-center self-stretch my-auto whitespace-nowrap min-h-[60px] w-[60px]">
            <div className="flex gap-2 flex-col justify-center items-center self-stretch my-auto w-[45px]">
                <img
                    src={iconSrc}
                    className="object-contain w-full aspect-square"
                    alt={label}
                />
                <p>{label}</p>
            </div>
        </div>
    );
}

const AMENITIES_MAP = {
    // 환경
    MOUNTAIN: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_MOUNTAIN.svg", label: "산" },
    //VALLEY: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_VALLEY.svg", label: "계곡" }, // 실제 이미지 URL로 변경 필요
    //FOREST: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_FOREST.svg", label: "숲" }, // 실제 이미지 URL로 변경 필요
    //RIVER: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_RIVER.svg", label: "강" }, // 실제 이미지 URL로 변경 필요
    //SEA: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_SEA.svg", label: "바다" },     // 실제 이미지 URL로 변경 필요

    // 주요 시설 및 서비스
    PUBLIC_TOILET: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_RESTROOM.svg", label: "공용화장실" },
    PUBLIC_SHOWER: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_SHOWER.svg", label: "공용샤워실" },
    //PUBLIC_BBQ: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_BBQ.svg", label: "공용 바비큐장" }, // 실제 이미지 URL로 변경 필요
    //PUBLIC_SINK: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_SINK.svg", label: "공용 개수대" }, // 실제 이미지 URL로 변경 필요
    //PARKING_LOT: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_PARKING.svg", label: "주차장" }, // 실제 이미지 URL로 변경 필요
    //PRIVATE_TOILET: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_PRIVATE_RESTROOM.svg", label: "개별 화장실" }, // 실제 이미지 URL로 변경 필요
    //PRIVATE_SHOWER: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_PRIVATE_SHOWER.svg", label: "개별 샤워실" }, // 실제 이미지 URL로 변경 필요
    CONVENIENCE_STORE: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_SHOP.svg", label: "매점" },
    //SWIMMING_POOL: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_POOL.svg", label: "수영장" }, // 실제 이미지 URL로 변경 필요
    ELECTRICITY: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_SOCKET.svg", label: "전기 사용" },
    WIFI: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_WIFI.svg", label: "WI-FI 제공" },
    PET_ALLOWED: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_PET.svg", label: "반려동물" },
    //CAMPFIRE_ALLOWED: { src: "https://storage.googleapis.com/m4gi/images/Amenity/AMEN_CAMPFIRE.svg", label: "불멍 가능" }, // 실제 이미지 URL로 변경 필요
    //'PUBLIC_BBQ', 'PUBLIC_SINK', 'WALKING_TRAIL', 'PARKING_LOT', 'WATER_FOUNTAIN', 'PRIVATE_TOILET', 'PRIVATE_SHOWER', 'CONVENIENCE_STORE','ELECTRICITY', 'WIFI', 'PET_ALLOWED', 'MOUNTAIN', 'VALLEY', 'SEA', 'FOREST', 'LAKE', 'FARMLAND', 'CITY_VIEW', 'CHERRY_BLOSSOM_SPOT', 'AUTUMN_LEAVES_SPOT', 'NIGHT_VIEW_SPOT', 'WATER_ACTIVITIES
};

export default function AmenityList({campgroundData}) {
    const [showAll, setShowAll] = useState(false);

    const amenities = campgroundData?.campground?.environments
        ? campgroundData.campground.environments.split(',').map(item => item.trim())
        : [];

    const renderableAmenities = amenities.filter(amenityCode => AMENITIES_MAP[amenityCode]);

    const displayedAmenities = showAll ? renderableAmenities : renderableAmenities.slice(0, 8);

    return (
        <section className="mt-4 w-full text-sm text-right h-[60px] max-md:max-w-full">
            {renderableAmenities.length > 8 && (
            <button
                className="text-fuchsia-700 max-md:max-w-full"
                onClick={() => setShowAll(!showAll)}
            >
                {showAll ? "간략히 보기" : "전체 보기"}
            </button>
            )}
            <div className="flex flex-wrap gap-10 justify-between items-center px-36 mt-2.5 w-full text-neutral-900 max-md:px-5 max-md:max-w-full">
            {displayedAmenities.map((amenityCode, index) => {
                    const amenityInfo = AMENITIES_MAP[amenityCode];
                    if (!amenityInfo) {
                        console.warn(`[AmenityList] 알 수 없는 편의시설 코드 또는 매핑 실패: "${amenityCode}" (index: ${index})`);
                        return null;
                    }
                    return (
                        <AmenityIcon key={index} iconSrc={amenityInfo.src} label={amenityInfo.label} />
                    );
                })}
            </div>
        </section>
    );
}
