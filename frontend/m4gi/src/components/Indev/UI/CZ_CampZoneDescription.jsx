import React, { useState } from "react";

export default function CZCampZoneDescription({zoneSiteData}) {
  const [expanded, setExpanded] = useState(false);

  const rawDescription = zoneSiteData?.description || ""; // 옵셔널 체이닝 사용

  // ✨ \\r\\n을 \n으로 변환합니다.
  const description = rawDescription.replace(/\\r\\n/g, '\n');

  console.log("zoneSiteData : ", zoneSiteData);

  const lineCount = description ? description.split('\n').length : 0;
  const showMoreButtonThreshold = 5; // 5줄 초과 시 (즉, 6줄부터) 버튼 표시

  // --- 설정값 ---
  // 축소 시 텍스트의 최대 높이 (예: text-sm 기준 약 5줄)
  const collapsedTextMaxHeight = 'max-h-24'; // 

  return (
    <section className="mt-8 w-full font-bold ">
      <h2 className="text-2xl text-neutral-900">
        구역 소개
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
        {!expanded && lineCount > showMoreButtonThreshold && (
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

      {lineCount > showMoreButtonThreshold && (
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
      )}
    </section>
  );
}