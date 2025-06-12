"use client";
import React from 'react';

export const SearchSection = () => {
  return (
    <section className="flex gap-4 justify-center items-center w-full max-md:flex-col max-md:gap-3 max-sm:flex-col max-sm:gap-2.5">
      <div className="flex gap-14 items-center px-3 py-2 h-10 bg-white rounded-md border border-solid border-zinc-200 w-[108px] max-md:w-full max-sm:w-full">
        <div className="text-sm leading-5 text-center text-black">
          제목
        </div>
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg id=\"351:4330\" width=\"17\" height=\"16\" viewBox=\"0 0 17 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"combobox-arrow\" style=\"width: 16px; height: 16px; flex-shrink: 0; opacity: 0.5\"> <g opacity=\"0.5\"> <path d=\"M4.56995 6L8.56995 10L12.5699 6\" stroke=\"black\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </g> </svg>",
            }}
          />
        </div>
      </div>
      <div className="flex gap-4 items-center px-4 py-2.5 bg-white rounded-md border border-solid border-zinc-200 flex-[1_0_0] max-md:w-full max-sm:w-full">
        <div>
          <div
            dangerouslySetInnerHTML={{
              __html:
                "<svg id=\"351:4333\" width=\"16\" height=\"16\" viewBox=\"0 0 16 16\" fill=\"none\" xmlns=\"http://www.w3.org/2000/svg\" class=\"search-icon\" style=\"width: 16px; height: 16px\"> <path d=\"M7.33333 12.6667C10.2789 12.6667 12.6667 10.2789 12.6667 7.33333C12.6667 4.38781 10.2789 2 7.33333 2C4.38781 2 2 4.38781 2 7.33333C2 10.2789 4.38781 12.6667 7.33333 12.6667Z\" stroke=\"#9CA3AF\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> <path d=\"M14 14L11.1333 11.1333\" stroke=\"#9CA3AF\" stroke-width=\"1.33333\" stroke-linecap=\"round\" stroke-linejoin=\"round\"></path> </svg>",
            }}
          />
        </div>
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          className="pt-1 pb-0 pl-0 h-5 text-sm text-zinc-500 bg-transparent border-none outline-none flex-1"
        />
      </div>
      <button className="px-4 py-2 h-10 text-base font-bold leading-5 text-center bg-fuchsia-700 rounded-md text-neutral-50 w-[94px] max-md:w-full max-sm:w-full">
        검색
      </button>
    </section>
  );
};
export default SearchSection;
