import React, { useState, useCallback, useRef, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import FormInput from "./FormInput";
import PhotoUploader from "../../MyPage/UI/MP_PhotoUploader";
import Button from "../../Common/Button";

// ★ 서버에 보낼 enum 값 매핑 객체
const zoneTypeMap = {
    "캠핑 존": "tent",
    "글램핑 존": "glamping",
    "카라반 존": "caravan",
    "오토 캠핑 존": "auto",
    "캠프닉 존": "campnic",
};

const zoneTerrainTypeMap = {
    "잔디/흙": "Grass",
    "데크": "Deck",
    "자갈/파쇄석": "Gravel",
    "모래": "Sand",
    "혼합": "Mixed",
    "기타": "Other",
};

// ★ 폼 데이터 초기 상태를 상수로 정의
const initialFormState = {
    zoneName: "",
    zoneType: "tent",
    zoneTerrainType: "Grass",
    capacity: "",
    description: "",
    defaultWeekdayPrice: "",
    defaultWeekendPrice: "",
    peakStartDate: "",
    peakEndDate: "",
    peakWeekdayPrice: "",
    peakWeekendPrice: "",
    zoneImages: { thumbnail: [], detail: [] },
};

export default function ZoneRegistrationSection({ campgroundId, editingZone, onSuccess }) {
    const [formData, setFormData] = useState(initialFormState);
    const [uploaderKey, setUploaderKey] = useState(Date.now());
    
    const isEditMode = !!editingZone; // editingZone 데이터가 있으면 true, 없으면 false

    // ★ 폼 데이터 상태 변경을 위한 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ★ 폼 초기화 
    const clearForm = () => {
        setFormData(initialFormState);
        setUploaderKey(Date.now());
    };

    // ★ 이미지 업로드 핸들러
    const handleImageUpload = useCallback((type, newUrls) => {
    setFormData(prev => {
        const currentUrls = prev.zoneImages[type];

        const areUrlsTheSame = 
            currentUrls.length === newUrls.length && 
            currentUrls.every((url, index) => url === newUrls[index]);

        // 만약 URL이 완전히 같다면, 불필요한 상태 업데이트와 리렌더링을 방지
        if (areUrlsTheSame) {
            return prev;
        }

        // URL이 변경되었을 때만 상태를 업데이트
        return {
            ...prev,
            zoneImages: { ...prev.zoneImages, [type]: newUrls }
        };
    });
}, []);
    
    // ★ 등록, 수정 모드에 따른 폼 상태 변경
    useEffect(() => {
        // 수정 모드: 폼에 데이터 채우기
        if (isEditMode && editingZone) {
            setFormData({
                zoneName: editingZone.zoneName || "",
                zoneType: editingZone.zoneType || "tent",
                zoneTerrainType: editingZone.zonezoneTerrainType || "Grass",
                capacity: editingZone.capacity?.toString() || "",
                description: editingZone.description || "",
                defaultWeekdayPrice: editingZone.defaultWeekdayPrice?.toString() || "",
                defaultWeekendPrice: editingZone.defaultWeekendPrice?.toString() || "",
                peakStartDate: editingZone.peakStartDate || "",
                peakEndDate: editingZone.peakEndDate || "",
                peakWeekdayPrice: editingZone.peakWeekdayPrice?.toString() || "",
                peakWeekendPrice: editingZone.peakWeekendPrice?.toString() || "",
                zoneImages: editingZone.zoneImagesStr ? JSON.parse(editingZone.zoneImagesStr) : { thumbnail: [], detail: [] }
            });
        } else {
            clearForm();
        }
        setUploaderKey(Date.now());
    }, [editingZone, isEditMode]);

    // ★ 등록/수정 모두 처리하는 단일 제출 함수
    const handleSubmit = async () => {
        // 유효성 검사
        if(!formData.zoneName.trim()) {
            return Swal.fire({
                title: '입력 오류',
                text: '존 이름을 입력해주세요.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500
            });
        }
        if(!formData.capacity) {
            return Swal.fire({
                title: '입력 오류',
                text: '최대 인원수를 입력해주세요.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500
            });
        }
        if (!formData.defaultWeekdayPrice || !formData.defaultWeekendPrice) {
            return Swal.fire({
                title: '입력 오류',
                text: '비수기 가격을 모두 입력해주세요.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500
            });
        }
        if(formData.zoneImages.thumbnail.length === 0) {
            return Swal.fire({
                title: '입력 오류',
                text: '대표 이미지를 등록해주세요.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500
            });
        }
        if (!formData.peakStartDate || !formData.peakEndDate || !formData.peakWeekdayPrice || !formData.peakWeekendPrice) {
            return Swal.fire({
                title: '입력 오류',
                text: '성수기 기간과 가격을 모두 입력해주세요.',
                icon: 'warning',
                showConfirmButton: false,
                timer: 1500
            });        
        }

        const payload = {
            campgroundId,
            ...formData,
            capacity: Number(formData.capacity),
            defaultWeekdayPrice: Number(formData.defaultWeekdayPrice),
            defaultWeekendPrice: Number(formData.defaultWeekendPrice),
            peakWeekdayPrice: Number(formData.peakWeekdayPrice) || null,
            peakWeekendPrice: Number(formData.peakWeekendPrice) || null,
            zoneImagesStr: JSON.stringify(formData.zoneImages),
        };

        try {
            const action = isEditMode ? "수정" : "등록";
            if (isEditMode) {
                // 수정 모드 -> 수정 API 호출
                await axios.put(`/web/api/staff/register/zones/${editingZone.zoneId}`, payload);
            } else {
                // 등록 모드 -> 등록 API 호출
                await axios.post("/web/api/staff/register/zones", payload);
            }

            await Swal.fire({
                title: `${action} 완료!`,
                text: `존 정보가 성공적으로 ${action}되었습니다.`,
                icon: 'success',
                iconColor: '#8C06AD',
                confirmButtonColor: '#8C06AD',
            });

            // 등록 모드에서 등록한 후, 폼 비우기
            if (!isEditMode) {
                clearForm();
            }
            onSuccess();

        } catch (err) {
            const action = isEditMode ? "수정" : "등록";
            console.error(`${action} 실패`, err);
            Swal.fire({
                title: `${action} 실패`,
                text: `존 정보 ${action} 중 오류가 발생했습니다.`,
                icon: 'error',
                confirmButtonColor: '#8C06AD',
            });
        }
    }

    // ★ 수정 취소 핸들러
    const handleCancelEdit = () => {
        onSuccess();
    };

  return (
    <div className="p-4">
        <header className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl text-cpurple">{isEditMode ? '존 수정' : '존 등록'}</h2>
            <p className="text-sm text-zinc-500">{isEditMode ? `'${editingZone.zoneName}'의 정보를 수정합니다.` : '캠핑장 내 존을 등록해주세요.'}</p>
        </header>
        <div className="space-y-4">
            {/* 존 이름 입력 */}
            <label>이름</label>
            <FormInput name="zoneName" placeholder="존 이름을 입력하세요." value={formData.zoneName} onChange={handleChange}/>

            {/* 존 유형 선택 */}
            <label>캠핑 유형</label>
            <select name="zoneType" value={formData.zoneType} onChange={handleChange} className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                {Object.entries(zoneTypeMap).map(([displayName, value]) => (
                    <option key={value} value={value}>{displayName}</option>
                ))}
            </select>

            {/* 지형 유형 선택 */}
            <label>지형 유형</label>
            <select name="zoneTerrainType" value={formData.zoneTerrainType} onChange={handleChange} className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                {Object.entries(zoneTerrainTypeMap).map(([displayName, value]) => (
                    <option key={value} value={value}>{displayName}</option>
                ))}
            </select>

            {/* 존 이름 입력 */}
            <label>최대 인원수</label>
            <FormInput type="number" name="capacity" value={formData.capacity} onChange={handleChange} placeholder="최대 인원수를 입력하세요."/>

            {/* 이미지 등록 */}
            <div>
                <label>구역 이미지</label>
                <PhotoUploader 
                    key={`thumb-${uploaderKey}`}
                    onUploadComplete={(urls) => handleImageUpload('thumbnail', urls)}
                    initialUrls={formData.zoneImages.thumbnail}
                    folder="images/Campground_images/zone"
                    MAX_IMAGES={1} 
                    title={`대표 이미지`} 
                />
                <PhotoUploader 
                    key={`detail-${uploaderKey}`}
                    onUploadComplete={(urls) => handleImageUpload('detail', urls)}
                    initialUrls={formData.zoneImages.detail}
                    folder="images/Campground_images/zone"
                    MAX_IMAGES={5} 
                    title={`상세 이미지`} 
                />
            </div>  

            {/* 설명 입력 */}
            <label>설명</label>
            <FormInput
                name="description"
                placeholder="존의 특징, 주의사항 및 위치 등을 입력해주세요."
                isTextarea
                value={formData.description}
                onChange={handleChange}
            />

            {/* 기본 가격 입력 */}
            <label>기본 가격 (1박 기준)</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" name="defaultWeekdayPrice" value={formData.defaultWeekdayPrice} onChange={handleChange} placeholder="비수기 평일 가격" />
                    <span>원</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" name="defaultWeekendPrice" value={formData.defaultWeekendPrice} onChange={handleChange} placeholder="비수기 주말 가격" />
                    <span>원</span>
                </div>
            </div>
            
            {/* 성수기 기간 입력 */}
            <label>성수기 기간</label>
            <div className="flex justify-center gap-4 items-center w-full">
                <FormInput type="date" name="peakStartDate" value={formData.peakStartDate} onChange={handleChange} />
                <span>~</span>
                <FormInput type="date" name="peakEndDate" value={formData.peakEndDate} onChange={handleChange} />
            </div>

            {/* 시즌별 가격 */}
            <label>성수기 가격 (1박 기준)</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" name="peakWeekdayPrice" placeholder="성수기 평일 가격" value={formData.peakWeekdayPrice} onChange={handleChange} />
                    <span>원</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="number" name="peakWeekendPrice" placeholder="성수기 주말 가격" value={formData.peakWeekendPrice} onChange={handleChange} />
                    <span>원</span>
                </div>
            </div>

            <div className="flex gap-4 mt-8 w-full">
                {/* 등록 버튼 */}
                <Button type="button" onClick={handleSubmit} className="w-full py-2 bg-cpurple text-white rounded">
                    {isEditMode ? '수정 완료' : '존 등록'}
                </Button>
                {/* 수정 모드일 때만 '취소' 버튼 표시 */}
                {isEditMode && (
                    <Button type="button" onClick={handleCancelEdit} className="w-full py-2 bg-clpurple text-cpurple rounded">
                        수정 취소
                    </Button>
                )}
            </div>
        </div>
    </div>
    );
}
