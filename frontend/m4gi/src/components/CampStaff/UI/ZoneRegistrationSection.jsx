import React, { useState, useCallback, useRef } from "react";
import axios from "axios";
import FormInput from "./FormInput";
import PhotoUploader from "../../MyPage/UI/MP_PhotoUploader";
import Button from "../../Common/Button";

// 서버에 보낼 enum 값 매핑 객체
const zoneTypeMap = {
    "캠핑 존": "tent",
    "글램핑 존": "glamping",
    "카라반 존": "caravan",
    "오토 캠핑 존": "auto",
    "캠프닉 존": "campnic",
};

const terrainTypeMap = {
    "잔디/흙": "Grass",
    "데크": "Deck",
    "자갈/파쇄석": "Gravel",
    "모래": "Sand",
    "혼합": "Mixed",
    "기타": "Other",
};

export default function ZoneRegistrationSection({ campgroundId, onSuccess }) {
    const [zoneName, setZoneName] = useState("");
    const [zoneType, setZoneType] = useState("tent");
    const [terrainType, setTerrainType] = useState("Grass");
    const [capacity, setCapacity] = useState("");
    const [description, setDescription] = useState("");
    const [priceWeekday, setPriceWeekday] = useState("");
    const [priceWeekend, setPriceWeekend] = useState("");
    const [peakStartDate, setPeakStartDate] = useState(""); // 성수기 시작일 상태 추가
    const [peakEndDate, setPeakEndDate] = useState("");     // 성수기 종료일 상태 추가
    const [peakPriceWeekday, setPeakPriceWeekday] = useState("");
    const [peakPriceWeekend, setPeakPriceWeekend] = useState("");
    const [zoneImages, setZoneImages] = useState({ thumbnail: [], detail: [] });
    const [uploaderKey, setUploaderKey] = useState(Date.now());

    // 이미지 업로드 완료 시 상태 업데이트 핸들러
    const handleThumbnailUpload = useCallback((urls) => {
        setZoneImages((prev) => ({ ...prev, thumbnail: urls }));
    }, []);

    const handleDetailUpload = useCallback((urls) => {
        setZoneImages((prev) => ({ ...prev, detail: urls }));
    }, []);

    // 폼 초기화 함수
    const clearForm = () => {
        setZoneName("");
        setZoneType("tent");
        setTerrainType("Grass");
        setCapacity("");
        setDescription("");
        setPriceWeekday("");
        setPriceWeekend("");
        setPeakStartDate("");
        setPeakEndDate("");
        setPeakPriceWeekday("");
        setPeakPriceWeekend("");
        setZoneImages({ thumbnail: [], detail: [] });
        setUploaderKey(Date.now());
    };

    // '존 등록' 버튼 클릭 시 실행될 메인 함수
    const handleRegisterZone = async () => {

        if (!campgroundId || !zoneName.trim() || !capacity) {
            alert("캠핑장 정보, 존 이름, 수용 인원은 필수입니다.");
            return;
        }

        // 요청 1: 기본 존 정보 등록
        const zonePayload = {
            campgroundId,
            zoneName,
            description,
            zoneImagesStr: JSON.stringify(zoneImages),
            capacity: Number(capacity),
            zoneType,
            zoneTerrainType: terrainType,
            defaultWeekdayPrice: Number(priceWeekday),
            defaultWeekendPrice: Number(priceWeekend),
        };

        try {
            console.log("서버로 전송되는 존 데이터:", zonePayload);
            const zoneResponse = await axios.post("/web/api/staff/register/zones", zonePayload);
            
            // 성수기 기간, 가격 등록을 위해 zoneId를 반환받음
            const newZoneId = zoneResponse.data.zoneId; 
            if (!newZoneId) {
                throw new Error("서버로부터 zoneId를 받지 못했습니다.");
            }

            // 요청 2: 성수기 가격 정보 등록 (성수기 가격이 입력된 경우에만)
            if (peakPriceWeekday && peakPriceWeekend && peakStartDate && peakEndDate) {
                const peakSeasonPayload = {
                    campgroundId,
                    zoneId: newZoneId,
                    peakStartDate,
                    peakEndDate,
                    peakWeekdayPrice: Number(peakPriceWeekday),
                    peakWeekendPrice: Number(peakPriceWeekend),
                };
                console.log("서버로 전송되는 성수기 데이터:", peakSeasonPayload);
                // API 엔드포인트는 실제 프로젝트에 맞게 수정 필요
                await axios.post("/web/api/staff/register/peak-seasons", peakSeasonPayload);
            }

            alert("✅ 존 및 성수기 정보 등록 성공!");
            clearForm();
            onSuccess();
        } catch (err) {
            console.error("등록 실패:", err);
            alert("❌ 등록 실패: " + (err.response?.data || err.message));
        }
    };

  return (
    <div className="p-4">
        <header className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl text-cpurple">존 등록</h2>
            <p className="text-sm text-zinc-500">캠핑장 내 존을 등록해주세요.</p>
        </header>
        <div className="space-y-4">
            {/* 존 이름 입력 */}
            <label>이름</label>
            <FormInput label="이름" placeholder="존 이름을 입력하세요." value={zoneName} onChange={(e) => setZoneName(e.target.value)}/>

            {/* 존 유형 선택 */}
            <label>캠핑 유형</label>
            <select value={zoneType} onChange={(e) => setZoneType(e.target.value)} className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                {Object.entries(zoneTypeMap).map(([displayName, value]) => (
                    <option key={value} value={value}>{displayName}</option>
                ))}
            </select>

            {/* 지형 유형 선택 */}
            <label>지형 유형</label>
            <select value={terrainType} onChange={(e) => setTerrainType(e.target.value)} className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                {Object.entries(terrainTypeMap).map(([displayName, value]) => (
                    <option key={value} value={value}>{displayName}</option>
                ))}
            </select>

            {/* 존 이름 입력 */}
            <label>최대 인원수</label>
            <FormInput type="number" label="최대 인원수" placeholder="최대 인원수를 입력하세요." value={capacity} onChange={(e) => setCapacity(e.target.value)}/>

            {/* 이미지 등록 */}
            <div>
                <label>구역 이미지</label>
                <PhotoUploader 
                    key={`thumb-${uploaderKey}`}
                    onUploadComplete={handleThumbnailUpload}
                    folder="images/Campground_images/zone"
                    MAX_IMAGES={1} 
                    title={`대표 이미지`} 
                />
                <PhotoUploader 
                    key={`detail-${uploaderKey}`}
                    onUploadComplete={handleDetailUpload}
                    folder="images/Campground_images/zone"
                    MAX_IMAGES={5} 
                    title={`상세 이미지`} 
                />
            </div>  

            {/* 설명 입력 */}
            <label>설명</label>
            <FormInput
                placeholder="존의 특징, 주의사항 및 위치 등을 입력해주세요."
                isTextarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
            />

            {/* 기본 가격 입력 */}
            <label>기본 가격 (1박 기준)</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" placeholder="비수기 평일 가격" value={priceWeekday} onChange={(e) => setPriceWeekday(e.target.value)} />
                    <span>원</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" placeholder="비수기 주말 가격" value={priceWeekend} onChange={(e) => setPriceWeekend(e.target.value)} />
                    <span>원</span>
                </div>
            </div>
            
            {/* 성수기 기간 입력 */}
            <label>성수기 기간</label>
            <div className="flex justify-center gap-4 items-center w-full">
                <FormInput type="date" value={peakStartDate} onChange={(e) => setPeakStartDate(e.target.value)} />
                <span>~</span>
                <FormInput type="date" value={peakEndDate} onChange={(e) => setPeakEndDate(e.target.value)} />
            </div>

            {/* 시즌별 가격 */}
            <label>성수기 가격 (1박 기준)</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" placeholder="성수기 평일 가격" value={peakPriceWeekday} onChange={(e) => setPeakPriceWeekday(e.target.value)} />
                    <span>원</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" placeholder="성수기 주말 가격" value={peakPriceWeekend} onChange={(e) => setPeakPriceWeekend(e.target.value)} />
                    <span>원</span>
                </div>
            </div>

            {/* 등록 버튼 */}
            <Button type="button" onClick={handleRegisterZone} className="w-full py-2 bg-cpurple text-white rounded">
                존 등록
            </Button>
        </div>
    </div>
    );
}
