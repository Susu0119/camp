"use client";
import React from 'react';

const RoomSelector = () => {
  return (
    <>
      <h2 className="self-stretch px-0 pt-3 pb-2 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        객실 선택
      </h2>
      <button className="flex justify-center items-start self-stretch p-3 bg-white rounded border border-solid border-stone-300 w-full">
        <div className="flex justify-center items-center pr-4 flex-[1_0_0]">
          <div className="flex items-start self-stretch w-full">
            <span className="text-base text-black max-sm:text-sm">글램핑 1호</span>
            <span className="text-base text-right text-black flex-[1_0_0] h-[21px]">
              ▼
            </span>
          </div>
        </div>
      </button>
    </>
  );
};

export default RoomSelector;
