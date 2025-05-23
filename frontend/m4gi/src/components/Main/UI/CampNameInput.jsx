import React from "react";

export default function CampNameInput( {value, onChange} ) {
  return (
    <div class="flex w-full items-center justify-between">
      <div class="flex h-[60px] w-full flex-1 shrink items-center gap-3.5 rounded-xl bg-[#E5E5E5] px-2.5 py-1.5">
        <div class="flex h-full flex-1 items-center gap-2.5">
          <div class="flex h-full w-12 items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-5.5">
              <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
            </svg>
          </div>
          <input placeholder="캠핑장명을 입력하세요." class="h-full w-full text-[#141414] placeholder-[#71717A] focus:outline-none" type="text" value={value} onChange={(e) => onChange(e.target.value)} />
        </div>
      </div>
    </div>
  );
}
