import React, { useState, useCallback, useEffect } from "react";
import axios from "axios";
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

export default function CampsiteInfoSection({ initialData, onSuccess }) {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false); // 수정 모드인지 여부

    const [campgroundName, setCampgroundName] = useState("");
    const [campgroundPhone, setCampgroundPhone] = useState("");
    const [addrBase, setAddrBase] = useState("");
    const [addrDetail, setAddrDetail] = useState("");
    const [campgroundType, setCampgroundType] = useState([]);
    const [description, setDescription] = useState("");
    const [campgroundVideo, setCampgroundVideo] = useState("");
    const [environments, setEnvironments] = useState([]);
    const [totalAreaSqm, setTotalAreaSqm] = useState(0);
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    const [campgroundImage, setCampgroundImage] = useState({
        thumbnail: [],
        detail: [],
        map: [],
    });

    // "HH:mm" 형식의 문자열로 변환
    const formatTime = (timeData) => {
    // 1: [15, 0] 같은 배열 형태 처리
    if (Array.isArray(timeData) && timeData.length >= 2) {
        const [hour, minute] = timeData;
        return `${String(hour).padStart(2, '0')}:${String(minute).padStart(2, '0')}`;
    }
    // 2: "15:00:00" 같은 문자열 형태 처리
    if (typeof timeData === 'string' && timeData.length >= 5) {
        return timeData.substring(0, 5);
    }
    // 그 외의 모든 경우 (null, undefined 등)
    return ""; 
    };

    // ★ initialData가 변경될 때마다 폼의 상태를 채움 => 수정 목적
    useEffect(() => {
        if (initialData) {
            console.log("초기 데이터 받음:", initialData);
            
            setIsEditMode(true);
            setCampgroundName(initialData.campgroundName || "");
            setCampgroundPhone(initialData.campgroundPhone || "");
            
            setAddrBase(initialData.addrFull || "");
            setAddrDetail("");
            
            setCampgroundType(initialData.campgroundTypeStr ? initialData.campgroundTypeStr.split(',') : []);
            setEnvironments(initialData.environmentsStr ? initialData.environmentsStr.split(',') : []);
            
            setDescription(initialData.description || "");
            setCampgroundVideo(initialData.campgroundVideo || "");
            setTotalAreaSqm(initialData.totalAreaSqm || 0);
            setCheckIn(formatTime(initialData.checkinTime));
            setCheckOut(formatTime(initialData.checkoutTime));

            try {
                setCampgroundImage(initialData.campgroundImageStr ? JSON.parse(initialData.campgroundImageStr) : { thumbnail: [], detail: [], map: [] });
            } catch (e) {
                console.error("이미지 정보 파싱 실패:", e);
                setCampgroundImage({ thumbnail: [], detail: [], map: [] });
            }
        }
    }, [initialData]);

    
    const handleThumbnailUpload = useCallback((urls) => {
        setCampgroundImage((prev) => ({ ...prev, thumbnail: urls }));
    }, []);
    
    const handleDetailUpload = useCallback((urls) => {
        setCampgroundImage((prev) => ({ ...prev, detail: urls }));
    }, []);
    
    const handleMapUpload = useCallback((urls) => {
        setCampgroundImage((prev) => ({ ...prev, map: urls }));
    }, []);
    
    // ★ 주소 검색이 완료됐을 때 실행될 핸들러
    const handleCompleteSearch = useCallback((data) => {
        let roadAddr = data.roadAddress;
        if (data.buildingName !== '' && data.apartment === 'Y') {
           roadAddr += ' (' + data.buildingName + ')';
        }
        
        // 기본 주소 상태 업데이트
        setAddrBase(roadAddr);
        
        // 모달 닫기
        setIsModalOpen(false);
        
        // 상세 주소 입력창으로 포커스 이동
        if (addrDetailRef.current) {
            addrDetailRef.current.focus();
        }
    }, []);

    // ★ 캠핑장 등록
    const handleRegisterCampground = async () => {
        // 유효성 검사 로직
        if (!campgroundName.trim()) {
            alert("캠핑장명을 입력해주세요.");
            return; // 함수 실행 중단
        }
        if (!campgroundPhone.trim()) {
            alert("연락처를 입력해주세요.");
            return;
        }
        if (!addrBase.trim()) { 
            alert("주소 검색을 통해 주소를 입력해주세요.");
            return;
        }
        if (campgroundType.length === 0) {
            alert("캠핑 유형을 하나 이상 선택해주세요.");
            return;
        }
        if (!description.trim()) {
            alert("캠핑장 소개를 입력해주세요.");
            return;
        }
        if (campgroundImage.thumbnail.length === 0) {
            alert("캠핑장 대표 이미지를 등록해주세요.");
            return;
        }
        if (!checkIn || !checkOut) {
            alert("체크인 및 체크아웃 시간을 설정해주세요.");
            return;
        }

        const fullAddress = (addrBase + " " + addrDetail).trim();

        const payload = {
            campgroundName,
            campgroundPhone,
            addrFull: fullAddress,
            campgroundTypeStr: campgroundType.join(","), // ex: "CAMPING,GLAMPING"
            description,
            campgroundImageStr: JSON.stringify(campgroundImage),
            campgroundVideo,
            environmentsStr: environments.join(","), // ex: "WIFI,PUBLIC_TOILET"
            totalAreaSqm,
            checkinTime: checkIn,
            checkoutTime: checkOut,
            mapService: "KAKAO",
        };
        
        console.log("서버로 전송되는 데이터:", payload); 
        
        try {
            if (isEditMode) {
                payload.campgroundId = initialData.campgroundId;
                // 수정 API 호출
                await axios.put("/web/api/staff/register/campgrounds", payload);
                alert("✅ 정보가 성공적으로 수정되었습니다.");
                if (onSuccess) onSuccess(initialData.campgroundId);
            } else {
                // 등록 API 호출
                const res = await axios.post("/web/api/staff/register/campgrounds", payload);
                if (onSuccess) onSuccess(res.data.campgroundId);
            }
            } catch (err) {
            console.error("등록 실패", err);
            alert("❌ 등록 실패");
        }
    };

    return (
        <>
            <FormSection>
                <header className="flex flex-col gap-2 mb-4">
                    <span className="text-xl text-cpurple">캠핑장 등록</span>
                    <span className="text-sm text-zinc-500">전체적인 캠핑장 정보에 대해 입력해주세요.</span>
                </header>
                <div className="space-y-4">
                    <label>캠핑장명</label>
                    <FormInput label="이름" placeholder="캠핑장명을 입력하세요." value={campgroundName} onChange={(e) => setCampgroundName(e.target.value)} />
                    <label>연락처</label>
                    <FormInput label="연락처" placeholder="연락처를 입력하세요. (010 - XXXX - XXXX 형식)" value={campgroundPhone} onChange={(e) => setCampgroundPhone(e.target.value)} />

                    {/* <div className="space-y-2">
                        <label>주소</label>
                        <div className="flex gap-2">
                            <FormInput placeholder="캠핑장 주소를 검색하세요." value={addrFull} onChange={(e) => setAddrFull(e.target.value)} />
                            <Button type="button" className="flex bg-cpurple text-white rounded-md whitespace-nowrap px-5 text-center h-[41.6px]">검색하기</Button>
                        </div>
                        <FormInput placeholder="도로명 주소를 입력하세요." value={addrSido} onChange={(e) => setAddrSido(e.target.value)} />
                        <FormInput placeholder="상세 주소를 입력하세요." value={addrSigungu} onChange={(e) => setAddrSigungu(e.target.value)} />
                    </div> */}

                    <div className="space-y-2">
                        <label>주소</label>
                        <div className="flex gap-2">
                            {/* '주소 검색' 버튼을 누르면 채워질 기본 주소 입력창 */}
                            <FormInput 
                                placeholder="캠핑장 주소를 검색하세요." 
                                value={addrBase} 
                                readOnly
                            />
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
                            placeholder="상세 주소를 입력하세요." 
                            value={addrDetail}
                            onChange={(e) => setAddrDetail(e.target.value)}
                        />
                    </div>


                    <div className="space-y-2">
                        <label>캠핑장 규모</label>
                        <FormInput placeholder="전체 부지 크기 (m²)" type="number" value={totalAreaSqm} onChange={(e) => setTotalAreaSqm(Number(e.target.value))} />
                    </div>

                    <div className="flex flex-col gap-4">
                        <label>운영 시간</label>
                        <div className="flex gap-5">
                            <span>체크인 시간: </span>
                            <TimeDropDown
                                value={checkIn}
                                onChange={(e) => setCheckIn(e.target.value)}
                            />
                            <span>체크아웃 시간: </span>
                            <TimeDropDown
                                value={checkOut}
                                onChange={(e) => setCheckOut(e.target.value)}
                            />
                        </div>
                    </div>

                    <div className="space-y-6">
                        {categories.map((category, idx) => {
                            const config = checkboxCategoryMap[category.title];
                            if (!config) return null;

                            return (
                                <div key={idx}>
                                <h3 className="mb-2">{category.title}</h3>
                                <div className="flex flex-wrap gap-5">
                                    {category.items.map((item, index) => {
                                    const value = config.values[item];
                                    const state = config.target === "campgroundType" ? campgroundType : environments;
                                    const setState = config.target === "campgroundType" ? setCampgroundType : setEnvironments;

                                    return (
                                        <label key={index} className="flex items-center gap-2">
                                        <input
                                            type="checkbox"
                                            className="accent-[#8C06AD] w-4 h-4"
                                            checked={state.includes(value)}
                                            onChange={(e) => {
                                            if (e.target.checked) {
                                                setState([...state, value]);
                                            } else {
                                                setState(state.filter((v) => v !== value));
                                            }
                                            }}
                                        />
                                        <span>{item}</span>
                                        </label>
                                    );
                                    })}
                                </div>
                                </div>
                            );
                            })}
                    </div>
                    
                    <div className="space-y-2">
                        <label>캠핑장 소개</label>
                        <FormInput label="소개 문구" placeholder="캠핑장 소개를 입력하세요." isTextarea className={`h-50`} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </div>

                    <div>
                        <label>캠핑장 이미지</label>
                        <PhotoUploader 
                            label="캠핑장 대표 이미지" 
                            placeholder="이미지 업로드" 
                            MAX_IMAGES={1} 
                            title={`대표 이미지`}
                            folder="images/Campground_images"
                            onUploadComplete={handleThumbnailUpload}
                            initialUrls={initialData && initialData.campgroundImageStr ? JSON.parse(initialData.campgroundImageStr).thumbnail : []}
                        />
                        <PhotoUploader 
                            label="캠핑장 상세 이미지" 
                            placeholder="이미지 업로드" 
                            MAX_IMAGES={5} 
                            title={`상세 이미지`}
                            folder="images/Campground_images"
                            onUploadComplete={handleDetailUpload}
                            initialUrls={initialData && initialData.campgroundImageStr ? JSON.parse(initialData.campgroundImageStr).detail : []}
                            />
                        <PhotoUploader 
                            label="캠핑장 지도 이미지" 
                            placeholder="이미지 업로드" 
                            MAX_IMAGES={1} 
                            title={`지도 이미지`}
                            folder="images/Campground_images"
                            onUploadComplete={handleMapUpload}
                            initialUrls={initialData && initialData.campgroundImageStr ? JSON.parse(initialData.campgroundImageStr).map : []}
                        />
                    </div>  
                    
                    <div className="space-y-2">
                        <label>캠핑장 소개 동영상 URL</label>
                        <FormInput label="캠핑장 동영상" placeholder="동영상 URL을 입력하세요." value={campgroundVideo} onChange={(e) => setCampgroundVideo(e.target.value)} />
                    </div>

                    <Button type="button" className="w-full bg-cpurple text-white rounded" onClick={handleRegisterCampground}>{isEditMode ? '캠핑장 정보 수정' : '캠핑장 등록'}</Button>
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

// ★ 모달 스타일
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