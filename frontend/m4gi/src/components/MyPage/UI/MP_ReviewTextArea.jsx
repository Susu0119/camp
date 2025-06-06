"use client";
import React from "react";
import FormField from "./MP_FormField";

const ReviewTextArea = () => {
  return (
    <FormField label="내용 입력" labelClassName="text-left w-full">
      <div className="w-full border border-gray-300 rounded-md p-2 mt-1 flex justify-center">
        <textarea
          className="w-full h-44 p-4 text-sm text-zinc-700 bg-white rounded-md resize-none placeholder-zinc-400 max-sm:text-xs"
          placeholder="(필수 입력란 입니다.) 내용을 30자 이상 입력해주세요."
        />
      </div>
    </FormField>
  );
};

export default ReviewTextArea;
