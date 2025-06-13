"use client";
import React, { useState } from "react";

const SearchSection = ({ onSearch }) => {
  const [keyword, setKeyword] = useState("");

  return (
    <section className="flex gap-4 justify-center items-center w-full max-md:flex-col max-md:gap-3">
      {/* 제목 필터(지금은 고정) */}
      <div className="flex gap-14 items-center px-3 py-2 h-10 bg-white rounded-md border border-zinc-200 w-[108px]">
        <span className="text-sm text-black">제목</span>
      </div>

      {/* 검색어 입력 */}
      <div className="flex gap-4 items-center px-4 py-2.5 bg-white rounded-md border border-zinc-200 flex-1">
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
          className="flex-1 text-sm text-zinc-700 bg-transparent outline-none"
        />
      </div>

      {/* 검색 버튼 */}
      <button
        onClick={() => onSearch(keyword)}
        className="px-4 py-2 h-10 text-base font-bold bg-fuchsia-700 text-white rounded-md"
      >
        검색
      </button>
    </section>
  );
};

export default SearchSection;
