"use client";
import React from "react";
import FormField from "./MP_FormField";

export default function ReviewTextArea ({ value, onChange }) {
  return (
    <FormField label="내용 입력" labelClassName="text-left w-full">
      <div className="w-full border border-gray-300 rounded-md p-2 mt-1 flex justify-center">
        <textarea
          className="w-full h-44 outline-none p-4 text-sm text-cblack bg-white rounded-md resize-none placeholder-zinc-400 "
          value={value}
          onChange={onChange}
          placeholder="내용을 30자 이상 입력해주세요."
        />
      </div>
    </FormField>
  );
};