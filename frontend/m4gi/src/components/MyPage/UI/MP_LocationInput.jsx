"use client";
import React from "react";
import FormField from "./MP_FormField";

const LocationInput = () => {
  return (
    <FormField label="이용 장소" labelClassName="text-left w-full">
      <div className="w-full border border-gray-300 rounded-md p-2 mt-1 flex items-center text-sm max-md:text-xs text-zinc-500 bg-white">
        가평 글램핑 하우스
      </div>
    </FormField>
  );
};

export default LocationInput;
