"use client";
import React, { useState } from "react";

export default function SiteDescription() {
  const [expanded, setExpanded] = useState(false);

  const description = `*청결을 최우선으로 합니다. (2024년 텐트천갈이 완료)
*버스타고 오실 수 있습니다. (정류장에서 무료픽업-차량5분거리)
*홈플러스 배달 가능지역(인터넷으로 미리 먹거리 주문하시고 편하게 몸만 오세요)
*(중요!)서로 배려 할 수 있는 캠핑장 지향합니다~ 밤10시이후엔 절대 정숙시간!과한 음주가무 싫어합니다!! 이웃 텐트에서 항의가 들어오면 즉시 퇴실 조치합니다.
*방문객 입장불가합니다!!
*반려동물 입장불가합니다!!
*차량은 장비나 짐 하차시에만 가능합니다. 상하차 후 대형주차장으로 옮겨주십시오.`;

  // --- 설정값 ---
  // 축소 시 텍스트의 최대 높이 (예: text-sm 기준 약 5줄)
  const collapsedTextMaxHeight = 'max-h-24'; // 

  return (
    <section className="mt-8 w-full font-bold ">
      <h2 className="text-2xl text-neutral-900">
        캠핑장 소개
      </h2>
      <div className="relative">
        <p
          className={`
            mt-2.5 text-sm text-zinc-500 whitespace-pre-line
            ${!expanded ? `${collapsedTextMaxHeight} overflow-hidden` : ''}
          `}
        >
          {description}
        </p>

        {/* 블러 오버레이 - 축소 상태일 때만 표시 */}
        {!expanded && (
          <div
            className="absolute bottom-0 left-0 right-0 h-14 pointer-events-none"
            style={{
              background: 'linear-gradient(transparent, rgba(255, 255, 255, 0.9))'
            }}
          >
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: 'blur(0.2px)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: 'blur(0.3px)',
              }}
            />
            <div
              className="absolute inset-0"
              style={{
                backdropFilter: 'blur(0.8px)',
              }}
            />
          </div>
        )}
      </div>

      <button
        className="flex overflow-hidden justify-center items-center mt-2.5 w-full text-base text-white whitespace-nowrap bg-fuchsia-700 rounded-lg min-h-[40px]"
        onClick={() => setExpanded(!expanded)}
      >
        <div className="flex gap-2.5 items-center self-stretch my-auto">
          <span className="self-stretch my-auto">
            {expanded ? '접기' : '더보기'}
          </span>
          <img
            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/03be2fb3e7426577d4f2a77abdcb9dfb04e5376c?placeholderIfAbsent=true"
            className={`object-contain shrink-0 self-stretch my-auto w-4 aspect-square transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
            alt={expanded ? "접기 화살표" : "더보기 화살표"}
          />
        </div>
      </button>
    </section>
  );
}