"use client";
import React from "react";

const ReviewDateRangeSelector = () => {
  return (
    <div className="flex flex-col gap-2 items-start px-2.5 pt-2.5 pb-4 w-full">
      <label className="text-sm font-bold leading-4 text-black">
        이용 날짜
      </label>
      <div className="flex relative gap-5 items-center max-md:flex-col max-md:gap-2.5 max-md:items-start">
        <div className="flex gap-2.5 items-center py-2.5 pr-2.5 pl-4 h-10 rounded-md border border-solid bg-white bg-opacity-10 border-neutral-200 w-[254px] max-sm:w-full">
          <svg
            width="29"
            height="30"
            viewBox="0 0 29 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="calendar-input-icon"
          >
            <g clipPath="url(#clip0_365_3985)">
              <path d="M9.25 0V2.25M19.75 0V2.25M5.5 15.75V4.5C5.5 3.90326 5.73705 3.33097 6.15901 2.90901C6.58097 2.48705 7.15326 2.25 7.75 2.25H21.25C21.8467 2.25 22.419 2.48705 22.841 2.90901C23.2629 3.33097 23.5 3.90326 23.5 4.5V15.75M5.5 15.75C5.5 16.3467 5.73705 16.919 6.15901 17.341C6.58097 17.7629 7.15326 18 7.75 18H21.25C21.8467 18 22.419 17.7629 22.841 17.341C23.2629 16.919 23.5 16.3467 23.5 15.75M5.5 15.75V8.25C5.5 7.65326 5.73705 7.08097 6.15901 6.65901C6.58097 6.23705 7.15326 6 7.75 6H21.25C21.8467 6 22.419 6.23705 22.841 6.65901C23.2629 7.08097 23.5 7.65326 23.5 8.25V15.75" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
            <defs>
              <clipPath id="clip0_365_3985">
                <rect width="28" height="33" fill="white" transform="translate(0.5)"></rect>
              </clipPath>
            </defs>
          </svg>
          <span className="text-sm leading-5 text-zinc-500">
            날짜를 선택해주세요.
          </span>
        </div>
        <span className="absolute left-2/4 text-2xl font-bold leading-5 -translate-x-2/4 text-zinc-500 max-md:static">
          ~
        </span>
        <div className="flex gap-2.5 items-center py-2.5 pr-2.5 pl-4 h-10 rounded-md border border-solid bg-white bg-opacity-10 border-neutral-200 w-[254px] max-sm:w-full">
          <svg
            width="28"
            height="30"
            viewBox="0 0 28 30"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="calendar-input-icon"
          >
            <g clipPath="url(#clip0_365_3990)">
              <path d="M8.75 0V2.25M19.25 0V2.25M5 15.75V4.5C5 3.90326 5.23705 3.33097 5.65901 2.90901C6.08097 2.48705 6.65326 2.25 7.25 2.25H20.75C21.3467 2.25 21.919 2.48705 22.341 2.90901C22.7629 3.33097 23 3.90326 23 4.5V15.75M5 15.75C5 16.3467 5.23705 16.919 5.65901 17.341C6.08097 17.7629 6.65326 18 7.25 18H20.75C21.3467 18 21.919 17.7629 22.341 17.341C22.7629 16.919 23 16.3467 23 15.75M5 15.75V8.25C5 7.65326 5.23705 7.08097 5.65901 6.65901C6.08097 6.23705 6.65326 6 7.25 6H20.75C21.3467 6 21.919 6.23705 22.341 6.65901C22.7629 7.08097 23 7.65326 23 8.25V15.75" stroke="#71717A" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"></path>
            </g>
            <defs>
              <clipPath id="clip0_365_3990">
                <rect width="28" height="33" fill="white"></rect>
              </clipPath>
            </defs>
          </svg>
          <span className="text-sm leading-5 text-zinc-500">
            날짜를 선택해주세요.
          </span>
        </div>
      </div>
    </div>
  );
};

export default ReviewDateRangeSelector;
