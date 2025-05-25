import React from "react";

export default function SearchButton ({onClick}) {
  return (
    <button type="button" onClick={onClick} className="flex flex-col items-center w-full text-lg text-center text-white bg-cpurple rounded-xl select-none cursor-pointer px-4 py-3">
      <div className="flex gap-2.5 items-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/40da32792b7948b3f519b3c9e1b2ab17df372807?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          alt="Search icon"
          className="object-contain shrink-0 self-stretch my-auto w-6 aspect-square"
        />
        <span className="self-stretch my-auto">검색하기</span>
      </div>
    </button>
  );
};
