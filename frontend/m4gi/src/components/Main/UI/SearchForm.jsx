import React, { useState } from "react";
import{ useNavigate } from "react-router-dom";
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

  const navigate = useNavigate();

  // 검색 결과 페이지 url에 담아갈 내용들
  const [campgroundName, setCampgronudName] = useState("");
  const [addrSiggunguList, setAddrSigunguList] = useState([]);
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(2);

  // 검색 버튼 클릭 시 searchResult 페이지로
  const handleSearch = () => {
    const params = new URLSearchParams({
      campgroundName,
      addrSiggunguList: addrSiggunguList.join(","),
      startDate,
      endDate,
      people: people.toString(),
      providerCode: "1", // 추후 수정 예정
      providerUserId: "user_1",
    });
    navigate(`/searchResult?${params.toString()}`);
  };

  return (
    <form className="flex flex-col justify-center p-2.5 w-full">
      <div className="flex flex-col w-full gap-5">
        <CampNameInput 
          value={campgroundName}
          onChange={setCampgronudName}
        />

        <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d6876cee698c54e2e3a35f480d4405064ad5dc80?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder="지역을 선택 해주세요."
          iconAlt="Location icon"
        />

        <RegionSelector 
          onSelectionChange={setAddrSigunguList}
        />

        <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3cfb3813c36c4fb01869edc22a56715b08b7d4e3?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder="날짜를 선택 해주세요."
          iconAlt="Calendar icon"
        />

        <DateSelector 
          startDate={startDate}
          endDate={endDate}
          setStartDate={setStartDate}
          setEndDate={setEndDate}
        />

        <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/6a53713129e933f7c8d0f0a243eb630a9643f7ec?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder="인원 수를 선택 해주세요."
          iconAlt="People icon"
        />

        <PersonCountSelector 
          people={people}
          setPeople={setPeople}
        />

        <SearchButton onClick={handleSearch} />
      </div>
    </form>
  );
}
