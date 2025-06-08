import React from "react";
import FormInput from "./FormInput";
import PhotoUploader from "../../MyPage/UI/MP_PhotoUploader";
import Button from "../../Common/Button";

export default function ZoneRegistrationSection() {
  return (
    <div className="p-4">
        <header className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl text-cpurple">존 등록</h2>
            <p className="text-sm text-zinc-500">캠핑장 내 존을 등록해주세요.</p>
        </header>
        <div className="space-y-4">
            {/* 존 이름 입력 */}
            <label>이름</label>
            <FormInput label="이름" placeholder="존 이름을 입력하세요." />

            {/* 존 유형 선택 */}
            <label>캠핑 유형</label>
            <select className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                <option>캠핑 존</option>
                <option>글램핑 존</option>
                <option>카라반 존</option>
                <option>오토 캠핑 존</option>
                <option>캠프닉 존</option>
            </select>

            {/* 지형 유형 선택 */}
            <label>지형 유형</label>
            <select className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                <option>잔디/흙</option>
                <option>데크</option>
                <option>자갈/파쇄석</option>
                <option>모래</option>
                <option>혼합</option>
                <option>기타</option>
            </select>

            {/* 이미지 등록 */}
            <div>
                <label>구역 이미지</label>
                <PhotoUploader label="구역 대표 이미지" placeholder="이미지 업로드" MAX_IMAGES={1} title={`대표 이미지`} />
                <PhotoUploader label="구역 상세 이미지" placeholder="이미지 업로드" MAX_IMAGES={5} title={`상세 이미지`} />
            </div>  

            {/* 설명 입력 */}
            <label>설명</label>
            <FormInput
                placeholder="존의 특징, 주의사항 및 위치 등을 입력해주세요."
                isTextarea
            />

            {/* 기본 가격 입력 */}
            <label>기본 가격 (1박 기준)</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="text" placeholder="비수기 평일 가격" />
                    <span>원</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="text" placeholder="비수기 주말 가격" />
                    <span>원</span>
                </div>
            </div>

            {/* 시즌별 가격 */}
            <label>성수기 가격 (1박 기준)</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="text" placeholder="성수기 평일 가격" />
                    <span>원</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="text" placeholder="성수기 주말 가격" />
                    <span>원</span>
                </div>
            </div>

            {/* 등록 버튼 */}
            <Button className="w-full py-2 bg-fuchsia-700 text-white rounded">
                존 등록
            </Button>
        </div>
    </div>
    );
}
