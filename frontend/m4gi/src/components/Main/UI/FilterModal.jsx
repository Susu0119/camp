// components/Main/UI/FilterModal.jsx
import React, { useRef, useEffect } from "react";

export default function FilterModal ({ isOpen, onClose, draftFilter, toggleFeature, onApplyFilter }) {
    

    // 캠핑장 캠핑 유형
    const CAMPGROUND_TYPE = [
        { label: "캠핑", value: "CAMPING" },
        { label: "카라반", value: "CARAVAN" },
        { label: "글램핑", value: "GLAMPING" },
        { label: "오토캠핑", value: "AUTO" },
        { label: "캠프닉", value: "CAMPNIC" },
    ];

    // 캠핑장 지형 유형
    const TERRAIN_TYPE = [
        { label: "잔디/흙", value: "Grass" },
        { label: "데크", value: "Deck" },
        { label: "자갈/파쇄석", value: "Gravel" },
        { label: "모래", value: "Sand" },
        { label: "혼합", value: "Mixed" },
        { label: "기타", value: "Other" },
    ];

    // 캠핑장 공용 시설
    const FACILITY_OPTIONS = [
        { label: "공용 화장실", value: "PUBLIC_TOILET" },
        { label: "공용 샤워실", value: "PUBLIC_SHOWER" },
        { label: "공용 바비큐장", value: "PUBLIC_BBQ" },
        { label: "공용 개수대", value: "PUBLIC_SINK" },
    ];

    // 캠핑장 편의 시설
    const CONVENIENCE_OPTIONS = [
        { label: "산책로", value: "WALKING_TRAIL" },
        { label: "주차장", value: "PARKING_LOT" },
        { label: "음수대", value: "WATER_FOUNTAIN" },
        { label: "개별 화장실", value: "PRIVATE_TOILET" },
        { label: "개별 샤워실", value: "PRIVATE_SHOWER" },
        { label: "매점", value: "CONVENIENCE_STORE" },
        { label: "수영장", value: "SWIMMING_POOL" },
        { label: "전기 사용 가능", value: "ELECTRICITY" },
        { label: "Wi-Fi 제공", value: "WIFI" },
    ];

    // 캠핑장 이용 가능/ 이용 환영 
    const USAGE_OPTIONS = [
        { label: "반려동물과 함께", value: "PET_ALLOWED" },
        { label: "아이와 함께", value: "KIDS_ALLOWED" },
        { label: "모닥불 허용", value: "CAMPFIRE_ALLOWED" },
    ];

    // 캠핑장 주변 환경
    const ENV_OPTIONS = [
        { label: "산", value: "MOUNTAIN" },
        { label: "계곡", value: "VALLEY" },
        { label: "바다", value: "SEA" },
        { label: "숲/삼림", value: "FOREST" },
        { label: "호수", value: "LAKE" },
        { label: "논/밭/농촌지역", value: "FARMLAND" },
        { label: "도시 전망", value: "CITY_VIEW" },
    ];

    // 캠핑장 특색
    const SIGNATURE_OPTIONS = [
        { label: "벚꽃 명소", value: "CHERRY_BLOSSOM_SPOT"},
        { label: "단풍 명소", value: "AUTUMN_LEAVES_SPOT"},
        { label: "야경 명소", value: "NIGHT_VIEW_SPOT"},
        { label: "물놀이 가능", value: "WATER_ACTIVITIES"},
    ]

    const RenderFilterGroup = (title, options, filterKey) => (
        <div className="mb-4">
        <p className="text-sm text-cblack mb-3">{title}</p>
        <div className="flex flex-wrap gap-2">
            {options.map(({ label, value }) => (
                <button
                    key={value}
                    onClick={() => toggleFeature(filterKey, value)}
                    className={`px-3 py-2 rounded-xl border text-sm
                    ${draftFilter[filterKey].includes(value)
                        ? "bg-clpurple text-cpurple border-clpurple"
                        : "bg-white text-cblack border-cgray"}`}
                >
                {label}
            </button>
            ))}
        </div>
        </div>
    );

    // 모달창 바깥 클릭 혹은 Esc 클릭 시 모달창 닫기
    const modalRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (e) => {
            if (modalRef.current && !modalRef.current.contains(e.target)) onClose();
        };
        const handleEsc = (e) => {
            if(e.key === "Escape") onClose();
        };
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleEsc);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
            document.removeEventListener("keydown", handleEsc);
        };
    }, [onClose]);

    return (
        <div className={`absolute w-[600px] top-full z-50 flex ${!isOpen ? 'hidden' : ''}`}>
            <div ref={modalRef} className="bg-white rounded-xl p-6 w-full shadow-lg relative">

            <h2 className="text-lg text-cblack mb-6">필터 선택</h2>
            {RenderFilterGroup("캠핑 유형", CAMPGROUND_TYPE, "campgroundTypes")}
            {RenderFilterGroup("지형 유형", TERRAIN_TYPE, "siteEnviroments")}
            {RenderFilterGroup("공용시설", FACILITY_OPTIONS, "featureList")}
            {RenderFilterGroup("편의시설", CONVENIENCE_OPTIONS, "featureList")}
            {RenderFilterGroup("이용 가능", USAGE_OPTIONS, "featureList")}
            {RenderFilterGroup("주변환경", ENV_OPTIONS, "featureList")}
            {RenderFilterGroup("캠핑장 테마", SIGNATURE_OPTIONS, "featureList")}
            
            <div className="mt-6 flex justify-end">
                <button 
                    onClick={() => {
                        onApplyFilter(draftFilter);
                        onClose();
                    }} 
                    className="px-4 py-2 text-sm border rounded-xl bg-cpurple text-white">
                    필터 적용하기
                </button>
            </div>
            </div>
        </div>
    );
};
