import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import TimeDropDown from "./TimeDropDown";
import Button from "../../Common/Button";
import PhotoUploader from "../../MyPage/UI/MP_PhotoUploader";
import DaumPostcode from 'react-daum-postcode';

const checkboxCategoryMap = {
  "캠핑 유형": {
    target: "campgroundType",
    values: {
      캠핑: "CAMPING", 
      글램핑: "GLAMPING",
      카라반: "CARAVAN",
      "오토 캠핑": "AUTO",
      캠프닉: "CAMPINIC",
    },
  },
  "공용시설": {
    target: "environments",
    values: {
      "공용 화장실": "PUBLIC_TOILET",
      "공용 샤워실": "PUBLIC_SHOWER",
      "공용 바비큐장": "PUBLIC_BBQ",
      "공용 개수대": "PUBLIC_SINK",
    },
  },
  "편의시설": {
    target: "environments",
    values: {
      산책로: "WALKING_TRAIL",
      주차장: "PARKING_LOT",
      음수대: "WATER_FOUNTAIN",
      "개별 화장실": "PRIVATE_TOILET",
      "개별 샤워실": "PRIVATE_SHOWER",
      매점: "CONVENIENCE_STORE",
      수영장: "SWIMMING_POOL",
      "전기 사용 가능": "ELECTRICITY",
      "WI-FI 제공": "WIFI",
    },
  },
  "이용 가능": {
    target: "environments",
    values: {
      "반려동물 동반": "PET_ALLOWED",
      "아이 동반": "KIDS_ALLOWED",
      "모닥불 허용": "CAMPFIRE_ALLOWED",
    },
  },
  "주변환경": {
    target: "environments",
    values: {
      산: "MOUNTAIN",
      계곡: "VALLEY",
      바다: "SEA",
      "숲/삼림": "FOREST",
      호수: "LAKE",
      "논/밭/농촌지역": "FARMLAND",
      도시전망: "CITY_VIEW",
    },
  },
  "캠핑장 특색": {
    target: "environments",
    values: {
      "벚꽃 명소": "CHERRY_BLOSSOM_SPOT",
      "단풍 명소": "AUTUMN_LEAVES_SPOT",
      "야경 명소": "NIGHT_VIEW_SPOT",
      "물놀이 가능": "WATER_ACTIVITIES",
    },
  },
};

const categories = Object.entries(checkboxCategoryMap).map(([title, config]) => ({
  title,
  items: Object.keys(config.values),
}));

// ★ 폼 데이터 초기 상태를 상수로 정의
const initialFormState = {
    campgroundName: "",
    campgroundPhone: "",
    addrBase: "",
    addrDetail: "",
    campgroundType: [],
    description: "",
    campgroundVideo: "",
    environments: [],
    totalAreaSqm: "",
    checkIn: "",
    checkOut: "",
    campgroundImage: { thumbnail: [], detail: [], map: [] },
};

export default function CampsiteInfoSection({ initialData, onSuccess, onUpdateSuccess  }) {
    const [formData, setFormData] = useState(initialFormState);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [uploaderKey, setUploaderKey] = useState(Date.now());

    const isEditMode = !!initialData;

    // ★ 모든 입력 처리를 위한 통합 핸들러
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    // ★ 체크박스 핸들러
    const handleCheckboxChange = (target, value) => {
        setFormData(prev => {
            const currentValues = prev[target];
            const newValues = currentValues.includes(value)
                ? currentValues.filter(v => v !== value)
                : [...currentValues, value];
            return { ...prev, [target]: newValues };
        });
    };

    // ★ 이미지 업로드 핸들러
    const handleImageUpload = useCallback((type, newUrls) => {
        setFormData(prev => {
            const currentUrls = prev.campgroundImage[type];

            // 새로 받은 URL 배열이 현재 상태의 URL 배열과 동일한지 확인
            const areUrlsTheSame = currentUrls.length === newUrls.length && currentUrls.every((url, index) => url === newUrls[index]);
            // URL이 동일하다면, 불필요한 상태 업데이트를 막아 무한 루프를 방지
            if (areUrlsTheSame) {
                return prev;
            }
            // URL이 변경되었을 때만 상태를 업데이트
            return {
                ...prev,
                campgroundImage: { ...prev.campgroundImage, [type]: newUrls }
            };
        });
        }, []);

    // ★ 주소 검색 핸들러
    const handleCompleteSearch = useCallback((data) => {
        setFormData(prev => ({ ...prev, addrBase: data.roadAddress }));
        setIsModalOpen(false);
    }, []);

    // ★ initialData가 변경될 때마다 폼의 상태를 채움 => 수정 목적
    useEffect(() => {
        if (isEditMode && initialData) {
            setFormData({
                campgroundName: initialData.campgroundName || "",
                campgroundPhone: initialData.campgroundPhone || "",
                addrBase: initialData.addrFull || "",
                addrDetail: "",
                campgroundType: initialData.campgroundTypeStr ? initialData.campgroundTypeStr.split(',') : [],
                description: initialData.description || "",
                campgroundVideo: initialData.campgroundVideo || "",
                environments: initialData.environmentsStr ? initialData.environmentsStr.split(',') : [],
                totalAreaSqm: initialData.totalAreaSqm || "",
                checkIn: initialData.checkinTime?.substring(0, 5) || "",
                checkOut: initialData.checkoutTime?.substring(0, 5) || "",
                campgroundImage: initialData.campgroundImageStr ? JSON.parse(initialData.campgroundImageStr) : { thumbnail: [], detail: [], map: [] },
            });
        } else {
            setFormData(initialFormState);
        }
        setUploaderKey(Date.now());
    }, [initialData, isEditMode]);

    // ★ 등록/수정 통합 제출 핸들러
    const handleSubmit = async () => {
        // 유효성 검사
        if (!formData.campgroundName.trim()) {
            alert("캠핑장명을 입력해주세요.");
            return; // 함수 실행 중단
        }
        if (!formData.campgroundPhone.trim()) {
            alert("연락처를 입력해주세요.");
            return;
        }
        if (!formData.addrBase.trim()) { 
            alert("주소 검색을 통해 주소를 입력해주세요.");
            return;
        }
        if (formData.campgroundType.length === 0) {
            alert("캠핑 유형을 하나 이상 선택해주세요.");
            return;
        }
        if (!formData.description.trim()) {
            alert("캠핑장 소개를 입력해주세요.");
            return;
        }
        if (formData.campgroundImage.thumbnail.length === 0) {
            alert("캠핑장 대표 이미지를 등록해주세요.");
            return;
        }
        if (!formData.checkIn || !formData.checkOut) {
            alert("체크인 및 체크아웃 시간을 설정해주세요.");
            return;
        }

        const payload = {
            ...formData,
            addrFull: (formData.addrBase + " " + formData.addrDetail).trim(),
            campgroundTypeStr: formData.campgroundType.join(","),
            environmentsStr: formData.environments.join(","),
            campgroundImageStr: JSON.stringify(formData.campgroundImage),
            totalAreaSqm: Number(formData.totalAreaSqm) || 0,
            checkinTime: formData.checkIn,
            checkoutTime: formData.checkOut,
            mapService: "KAKAO",
        };
        delete payload.addrBase;
        delete payload.addrDetail;

        try {
            const action = isEditMode ? "수정" : "등록";
            if (isEditMode) {
                payload.campgroundId = initialData.campgroundId;
                const response = await axios.put("/web/api/staff/register/campgrounds", payload);
                await Swal.fire({
                    title: '수정 완료',
                    text: '캠핑장 정보가 성공적으로 수정되었습니다.',
                    icon: 'success',
                    iconColor: '#8C06AD',
                    confirmButtonColor: '#8C06AD',
                });
                if (onUpdateSuccess) onUpdateSuccess(response.data);
            } else {
                const response = await axios.post("/web/api/staff/register/campgrounds", payload);
                await Swal.fire({
                    title: '등록 완료',
                    text: `캠핑장 등록 성공! 이제 존을 등록해주세요.`,
                    icon: 'success',
                    iconColor: '#8C06AD',
                    confirmButtonColor: '#8C06AD'
                });
                if (onSuccess) onSuccess(response.data.campgroundId);
            }
        } catch (err) {
            console.error("작업 실패:", err);
            Swal.fire({
                title: `${action} 실패`,
                text: `캠핑장 정보 ${action} 중 오류가 발생했습니다.`,
                icon: 'error',
                confirmButtonColor: '#8C06AD'
            });
        }
    };

    return (
        <>
            <FormSection>
                <header className="flex flex-col gap-2 mb-4">
                    <span className="text-xl text-cpurple">{isEditMode ? '캠핑장 정보 수정' : '캠핑장 등록'}</span>
                    <p className="text-sm text-zinc-500">전체적인 캠핑장 정보에 대해 입력해주세요.</p>
                </header>
                <div className="space-y-4">
                    <label>캠핑장명</label>
                    <FormInput label="이름" placeholder="캠핑장명을 입력하세요." name="campgroundName" value={formData.campgroundName} onChange={handleChange} />
                    
                    <label>연락처</label>
                    <FormInput label="연락처" placeholder="연락처를 입력하세요. (010 - XXXX - XXXX 형식)" name="campgroundPhone" value={formData.campgroundPhone} onChange={handleChange} />

                    <div>
                        <label>주소</label>
                        <div className="flex items-center gap-2">
                            {/* '주소 검색' 버튼을 누르면 채워질 기본 주소 입력창 */}
                            <div className="flex-grow -mt-3">
                                <FormInput
                                    name="campgroundPhone"
                                    placeholder="캠핑장 주소를 검색하세요." 
                                    value={formData.addrBase} 
                                    onChange={handleChange}
                                    readOnly
                                />
                            </div>
                            <Button 
                                type="button"
                                className="flex bg-cpurple text-white rounded-md whitespace-nowrap px-5 text-center h-[41.6px]"
                                onClick={() => setIsModalOpen(true)}
                            >
                                검색하기
                            </Button>
                        </div>
                        {/* 사용자가 직접 입력할 상세 주소 입력창 */}
                        <FormInput 
                            name="addrDetail"
                            placeholder="상세 주소를 입력하세요." 
                            value={formData.addrDetail}
                            onChange={handleChange}
                        />
                    </div>


                    <div className="space-y-2">
                        <label>캠핑장 규모</label>
                        <FormInput name="totalAreaSqm" placeholder="전체 부지 크기 (m²)" type="number" value={formData.totalAreaSqm} onChange={handleChange} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label>운영 시간</label>
                        <div className="flex mx-auto gap-15">
                            <span>체크인 시간: </span>
                            <TimeDropDown
                                name="checkIn"
                                value={formData.checkIn} 
                                onChange={handleChange}
                            />
                            <span>체크아웃 시간: </span>
                            <TimeDropDown
                                name="checkOut"
                                value={formData.checkOut} 
                                onChange={handleChange}
                            />
                        </div>
                    </div>

                    {categories.map((category) => (
                        <div key={category.title}>
                            <h3 className="mb-2">{category.title}</h3>
                            <div className="flex flex-wrap gap-5">
                                {category.items.map((item) => {
                                    const config = checkboxCategoryMap[category.title];
                                    const value = config.values[item];
                                    return (
                                        <label key={value} className="flex items-center gap-2">
                                            <input type="checkbox"
                                                checked={formData[config.target].includes(value)}
                                                onChange={() => handleCheckboxChange(config.target, value)}
                                            />
                                            <span>{item}</span>
                                        </label>
                                    );
                                })}
                            </div>
                        </div>
                    ))}
                    
                    <div className="space-y-2">
                        <label>캠핑장 소개</label>
                        <FormInput name="description" label="소개 문구" placeholder="캠핑장 소개를 입력하세요." isTextarea className={`h-50`} value={formData.description} onChange={handleChange} />
                    </div>

                    <div>
                        <label>캠핑장 이미지</label>
                        <PhotoUploader 
                            key={`thumb-${uploaderKey}`} 
                            title="대표 이미지 (1장)" 
                            MAX_IMAGES={1} 
                            onUploadComplete={(urls) => handleImageUpload('thumbnail', urls)}
                            initialUrls={formData.campgroundImage.thumbnail}                        
                        />
                        <PhotoUploader 
                            key={`detail-${uploaderKey}`} 
                            title="상세 이미지 (최대 5장)" 
                            MAX_IMAGES={5} 
                            onUploadComplete={(urls) => handleImageUpload('detail', urls)} 
                            initialUrls={formData.campgroundImage.detail}
                        />
                        <PhotoUploader 
                            key={`map-${uploaderKey}`} 
                            title="지도 이미지 (1장)" 
                            MAX_IMAGES={1} 
                            onUploadComplete={(urls) => handleImageUpload('map', urls)} 
                            initialUrls={formData.campgroundImage.map}
                        />
                    </div>  
                    
                    <div className="space-y-2">
                        <label>캠핑장 소개 동영상 URL</label>
                        <FormInput name="campgroundVideo" placeholder="동영상 URL을 입력하세요." value={formData.campgroundVideo} onChange={handleChange} />
                    </div>

                    <Button type="button" onClick={handleSubmit} className="w-full mt-8 bg-cpurple text-white rounded">
                        {isEditMode ? '캠핑장 정보 수정' : '캠핑장 등록'}
                    </Button>
                </div>
            </FormSection>

            {/* 주소 검색 모달창 */}
            {isModalOpen && (
                <div style={modalContainerStyle}>
                    <div style={modalContentStyle}>
                        <DaumPostcode 
                            onComplete={handleCompleteSearch}
                            autoClose={false} // 값을 선택해도 자동으로 닫히지 않게 설정
                        />
                        <Button 
                            type="button" 
                            onClick={() => setIsModalOpen(false)}
                            className="mt-2 w-full bg-zinc-400 text-white rounded"
                        >
                            닫기
                        </Button>
                    </div>
                </div>
            )}
        </>
    );
}

// ★ 주소 검색 모달 스타일
const modalContainerStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
};

const modalContentStyle = {
    backgroundColor: 'white',
    padding: '20px',
    borderRadius: '8px',
    width: '90%',
    maxWidth: '500px',
};