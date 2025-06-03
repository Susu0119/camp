"use client";
import React from "react";

const SearchButton = ({ onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-4 pt-2.5 pb-2.5 mx-2.5 my-0 h-10 text-sm font-bold leading-5 bg-fuchsia-700 rounded-md cursor-pointer text-neutral-50 w-[652px] max-md:w-full max-sm:m-0 max-sm:w-full"
    >
      조회하기
    </button>
  );
};

export default SearchButton;
