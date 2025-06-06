"use client";
import React from "react";

const ReviewLocationSelector = () => {
  return (
    <div className="flex flex-col gap-2 items-start pt-0 pr-0 pb-1.5 pl-2.5 w-full">
      <label className="text-sm font-bold leading-4 text-black">
        이용 장소
      </label>
      <input
        type="text"
        placeholder="어느 곳을 방문하셨나요?"
        className="gap-4 px-4 pt-2.5 pb-2.5 mx-2.5 my-0 h-10 text-sm leading-5 bg-white rounded-md border border-solid border-zinc-200 text-zinc-500 w-[617px] max-md:w-full max-sm:m-0 max-sm:w-full"
      />
    </div>
  );
};

export default ReviewLocationSelector;
