"use client";
import React from "react";
import DateRangeSelector from "./DateRangeSelector";
import LocationInput from "./LocationInput";
import RatingSelector from "./RatingSelector";
import PhotoUploader from "./PhotoUploader";
import ReviewTextArea from "./ReviewTextArea";
import SubmitButton from "./SubmitButton";

const ReviewFormContent = () => {
  return (
    <section className="flex absolute top-0 flex-col items-center px-10 pt-10 pb-5 h-[924px] left-[291px] w-[1149px] max-md:left-0 max-md:p-5 max-md:w-full max-sm:p-4">
      <div className="flex flex-col gap-4 items-start px-0 pt-2.5 pb-5 max-w-2xl w-[672px] max-md:w-full max-md:max-w-[600px]">
        <header className="flex flex-col gap-2.5 items-start self-stretch py-2.5 pr-2.5 pl-2 h-[78px]">
          <h1 className="text-2xl font-bold leading-5 text-black max-sm:text-xl">
            리뷰 작성
          </h1>
          <p className="text-sm leading-5 text-zinc-500 max-sm:text-xs">
            생생한 방문 후기를 남겨주세요!
          </p>
        </header>

        <div className="flex flex-col gap-6 items-start self-stretch rounded-md">
          <form className="flex flex-col gap-2 items-start self-stretch px-2.5 pt-0 pb-3.5 rounded-md border border-solid border-zinc-200 w-[672px] max-md:w-full">
            <DateRangeSelector />
            <LocationInput />
            <RatingSelector />
            <PhotoUploader />
            <ReviewTextArea />
          </form>
        </div>

        <SubmitButton />
      </div>
    </section>
  );
};

export default ReviewFormContent;
