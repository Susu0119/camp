import React, { useState } from "react";
import FormSection from "./FormSection";
import FormInput from "./FormInput";
import TimeDropDown from "./TimeDropDown";
import Button from "../../Common/Button";
import PhotoUploader from "../../MyPage/UI/MP_PhotoUploader";

const categories = [
  {
    title: "캠핑 유형",
    items: ["캠핑", "글램핑", "카라반", "오토 캠핑", "캠프닉"],
  },
  {
    title: "공용시설",
    items: ["공용 화장실", "공용 샤워실", "공용 바비큐장", "공용 개수대"],
  },
  {
    title: "편의시설",
    items: [
      "주차장", "산책로", "음수대", "개별 화장실",
      "개별 샤워실", "매점", "수영장", "전기 사용 가능", "WI-FI 제공",
    ],
  },
  {
    title: "이용 가능",
    items: ["반려동물과 함께", "아이와 함께", "모닥불 허용"],
  },
  {
    title: "주변환경",
    items: ["산", "계곡", "바다", "숲/삼림", "호수", "논/밭/농촌지역", "도시 전망"],
  },
  {
      title: "허용 여부",
      items: ["반려동물 동반 허용", "아이 동반 허용 (환영)", "모닥불 허용"],
    },
    {
        title: "주변 환경",
        items: ["산", "계곡", "바다", "숲/삼림", "호수", "논/밭/농촌지역", "도시 전망"],
    },
    {
      title: "캠핑장 특색",
      items: ["벚꽃 명소", "단풍 명소", "야경 명소", "물놀이 가능"],
    },
//   {
//     title: "추가 옵션",
//     items: [
//       "바베큐 그릴 대여", "침낭/매트 대여", "숯/장작 추가 구매", "냉/난방기기 대여",
//     ],
//   },
];


export default function CampsiteInfoSection() {
    const [checkIn, setCheckIn] = useState("");
    const [checkOut, setCheckOut] = useState("");
    return (
        <FormSection>
            <header className="flex flex-col gap-2 mb-4">
                <span className="text-xl text-cpurple">캠핑장 등록</span>
                <span className="text-sm text-zinc-500">전체적인 캠핑장 정보에 대해 입력해주세요.</span>
            </header>
            <div className="space-y-4">
                <label>캠핑장명</label>
                <FormInput label="이름" placeholder="캠핑장명을 입력하세요." />
                <label>연락처</label>
                <FormInput label="연락처" placeholder="연락처를 입력하세요. (010 - XXXX - XXXX 형식)" />

                <div className="space-y-2">
                    <label>주소</label>
                    <div className="flex gap-2">
                        <FormInput placeholder="캠핑장 주소를 검색하세요." />
                        <Button type="button" className="flex bg-cpurple text-white rounded-md whitespace-nowrap px-5 text-center h-[41.6px]">검색하기</Button>
                    </div>
                    <FormInput placeholder="도로명 주소를 입력하세요." />
                    <FormInput placeholder="상세 주소를 입력하세요." />
                </div>

                <div className="space-y-2">
                    <label>캠핑장 규모</label>
                    <FormInput placeholder="전체 부지 크기 (m²)" />
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
                        {categories.map((category, idx) => (
                            <div key={idx}>
                                <h3 className="mb-2">{category.title}</h3>
                                <div className="flex flex-wrap gap-5">
                                    {category.items.map((item, index) => (
                                        <label key={index} className="flex items-center gap-2">
                                            <input type="checkbox" className="accent-[#8C06AD] w-4 h-4" defaultChecked />
                                            <span>{item}</span>
                                        </label>
                                    ))}
                                </div>
                            </div>
                        ))}
                    </div>
                
                <div className="space-y-2">
                    <label>캠핑장 소개</label>
                    <FormInput label="소개 문구" placeholder="캠핑장 소개를 입력하세요." isTextarea className={`h-50`} />
                </div>

                <div>
                    <label>캠핑장 이미지</label>
                    <PhotoUploader label="캠핑장 대표 이미지" placeholder="이미지 업로드" MAX_IMAGES={1} title={`대표 이미지`} />
                    <PhotoUploader label="캠핑장 상세 이미지" placeholder="이미지 업로드" MAX_IMAGES={5} title={`상세 이미지`} />
                    <PhotoUploader label="캠핑장 지도 이미지" placeholder="이미지 업로드" MAX_IMAGES={1} title={`지도 이미지`} />
                </div>  
                
                <div className="space-y-2">
                    <label>캠핑장 소개 동영상 URL</label>
                    <FormInput label="캠핑장 동영상" placeholder="동영상 URL을 입력하세요." />
                </div>

                <Button className="w-full bg-cpurple text-white rounded">캠핑장 등록</Button>
            </div>
        </FormSection>
    );
}
