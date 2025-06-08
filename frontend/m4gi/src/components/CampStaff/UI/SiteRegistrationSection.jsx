"use client";
import React from "react";
import FormInput from "./FormInput";

export default function SiteRegistrationSection() {
  return (
    <div className="p-4">
        <header className="flex flex-col gap-2 mb-4">
            <h2 className="text-xl text-cpurple">사이트 등록</h2>
            <p className="text-sm text-zinc-500">구역 내 사이트을 등록해주세요.</p>
        </header>
        <div className="space-y-4">
            {/* 존 선택 */}
            <label>소속 존</label>
            <select className="w-full px-4 py-2 mb-4 border border-zinc-200 rounded">
                {/* Todo: 수정 필요 */}
                <option>캠핑 존</option>
                <option>글램핑 존</option>
                <option>카라반 존</option>  
                <option>오토 캠핑 존</option>
                <option>캠프닉 존</option>
            </select>
            
            {/* 사이트 이름 입력 */}
            <label>이름</label>
            <FormInput label="이름" placeholder="구역명을 제외한 사이트 이름/번호를 입력하세요. (예: 01, 02, 별, 달)" />
        
            {/* 면적 및 크기 입력 */}
            <label>면적 및 크기</label>
            <div className="flex flex-col mb-4">
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="text" placeholder="가로 크기" />
                    <span>m</span>
                </div>
                <div className="flex justify-center gap-2 items-center w-full">
                    <FormInput type="text" placeholder="세로 크기" />
                    <span>m</span>
                </div>
            </div>

        </div>
    </div>
  );
}
