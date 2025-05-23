import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import CampNameInput from "./CampNameInput.jsx";
import SearchInput from "./SearchInput.jsx";
import RegionSelector from "./RegionSelector.jsx";
import Calendar from "../../Indev/UI/Calendar.jsx";
import PersonCountSelector from "./PersonCountSelector.jsx";
import SearchButton from "./SearchButton.jsx";

export default function SearchForm() {
  const locationIcon = `<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1 1 15 0Z" />
  </svg>`;

  const navigate = useNavigate();

  // 검색 결과 페이지 url에 담아갈 내용들
  const [campgroundName, setCampgronudName] = useState("");
  const [addrSigunguList, setAddrSigunguList] = useState([]);
  const [startDate, setStartDate] = useState(""); // YYYY-MM-DD
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(2);

  // Date 객체를 YYYY-MM-DD 형식의 문자열로 변환
  const formatDateToString = (dateObj) => {
    if(!dateObj) return "";

    const year = dateObj.getFullYear();
    const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
    const day = dateObj.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
  };

  // Calendar 에서 날짜 범위가 변경될 때마다 호출
  const handleDateChange = (range) => {
    setStartDate(formatDateToString(range.start));
    setEndDate(formatDateToString(range.end));
    console.log(startDate);
    console.log(endDate);
  };

  // 검색 버튼 클릭 시 searchResult 페이지로
  const handleSearch = () => {
    const params = new URLSearchParams();
    if(campgroundName) params.append("campgroundName", campgroundName);
    if(addrSigunguList.length > 0) params.append("addrSigunguList", addrSigunguList);
    if(startDate) params.append("startDate", startDate);
    if(endDate) params.append("endDate", endDate);
    params.append("people", people.toString());
    params.append("providerCode", "1");           // 추후 수정 예정 (user provideCode) - 위시리스트 추가 여부 판단을 위해 임시로 추가되어 있음
    params.append("providerUserId", "user_1");    // 추후 수정 예정 (user providerUserId)
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

        <Calendar onDateRangeChange={handleDateChange} />

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
