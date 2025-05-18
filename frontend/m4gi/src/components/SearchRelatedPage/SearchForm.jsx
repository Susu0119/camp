import React from "react";
import CampNameInput from "./CampNameInput.jsx";
import SearchInput from "./SearchInput.jsx";
import RegionSelector from "./RegionSelector";
import DateSelector from "./DateSelector";
import PersonCountSelector from "./PersonCountSelector.jsx";
import SearchButton from "./SearchButton";

export default function CampSearchForm() {
  const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
</svg>`;

  return (
    <form className="flex flex-col justify-center p-2.5 w-full">
      <div className="flex flex-col w-full gap-5">
        <CampNameInput />

        <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d6876cee698c54e2e3a35f480d4405064ad5dc80?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder="지역을 선택 해주세요."
          iconAlt="Location icon"
        />

        <RegionSelector />

        <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3cfb3813c36c4fb01869edc22a56715b08b7d4e3?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder="날짜를 선택 해주세요."
          iconAlt="Calendar icon"
        />

        <DateSelector />

        <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/6a53713129e933f7c8d0f0a243eb630a9643f7ec?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder="인원 수를 선택 해주세요."
          iconAlt="People icon"
        />

        <PersonCountSelector />

        <SearchButton />
      </div>
    </form>
  );
}
