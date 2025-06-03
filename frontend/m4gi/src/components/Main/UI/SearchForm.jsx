import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CampNameInput from "./CampNameInput.jsx";
import SearchInput from "./SearchInput.jsx";
import RegionSelector from "./RegionSelector.jsx";
import Calendar from "../../Indev/UI/Calendar.jsx";
import PersonCountSelector from "./PersonCountSelector.jsx";
import { Button } from "../../Common/Button.jsx";

export default function SearchForm() {
  const navigate = useNavigate(); 

  // ★ 지역, 날짜, 인원수 검색 구역 클릭 시 Selector 표시용 상태 ('region', 'date', 'people', 또는 null)
  const [activeSelector, setActiveSelector] = useState(null);

  // 특정 Selector 선택기 토글 함수
  const handleSelectorToggle = (selectorName) => {
    setActiveSelector(prevActiveSelector => {
      const newActiveSelector = prevActiveSelector === selectorName ? null : selectorName;
      return newActiveSelector;
    });
  };
  
  // ★ 검색 결과 페이지 url에 담아갈 내용들 변환 및 페이지 이동
  const [campgroundName, setCampgroundName] = useState("");
  const [addrSigunguList, setAddrSigunguList] = useState([]);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [people, setPeople] = useState(2);

  // Calendar 에서 날짜 범위가 변경될 때마다 호출 (+ YYYY-MM-DD 로 변환)
  const handleDateChange = (range) => {
    const formatDate = (date) => {
      if (!date) return "";
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    };

    setStartDate(formatDate(range.start));
    setEndDate(formatDate(range.end));
  };

  // 검색 버튼 클릭 시 searchResult 페이지로
  const handleSearch = () => {
    const params = new URLSearchParams();
    
    if (campgroundName) params.set("campgroundName", campgroundName);
    if (addrSigunguList.length > 0) {
      addrSigunguList.forEach(sigungu => {
        params.append("addrSigunguList", sigungu);
      });
    }
    if (startDate) params.set("startDate", startDate);
    if (endDate) params.set("endDate", endDate);
    params.set("people", people.toString());
    params.set("providerCode", "1"); // 임시 고정
    params.set("providerUserId", "puid_0001");

    navigate(`/searchResult?${params.toString()}`);
  };


  return (
    <form className="flex flex-col justify-center p-2.5 w-full">
      <div className="flex flex-col w-full gap-5">
        {/* 캠핑장명 입력 */}
        <CampNameInput
          value={campgroundName}
          onChange={setCampgroundName}
        />
        {/* 지역 선택 */}
        <div 
          onClick={() => {
            handleSelectorToggle('region');
          }}
          className="cursor-pointer" 
          role="button" tabIndex={0} 
        >
          <SearchInput
            icon="https://cdn.builder.io/api/v1/image/assets/TEMP/d6876cee698c54e2e3a35f480d4405064ad5dc80?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
            placeholder={addrSigunguList.length > 0 ? addrSigunguList.join(', ') : "지역을 선택 해주세요."}
            value={addrSigunguList.join(', ')}
            iconAlt="Location icon"
          />
        </div>
        {activeSelector === 'region' && (
          <RegionSelector
            onSelectionChange={(selectedRegions) => {
              setAddrSigunguList(selectedRegions);
            }}
          />
        )}

        {/* 날짜 선택 */}
        <div 
          onClick={() => {
            handleSelectorToggle('date');
          }}
          className="cursor-pointer" 
          role="button" tabIndex={0} 
        >
          <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/3cfb3813c36c4fb01869edc22a56715b08b7d4e3?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder={startDate && endDate ? `${startDate} ~ ${endDate}` : "날짜를 선택 해주세요."}
          readOnly
          iconAlt="Calendar icon"
          />
        </div>
        {activeSelector === 'date' && (
          <Calendar onDateRangeChange={handleDateChange} />
        )}

        {/* 인원수 입력 */}
        <div 
          onClick={() => {
            handleSelectorToggle('people');
          }}
          className="cursor-pointer" 
          role="button" tabIndex={0} 
        >
          <SearchInput
          icon="https://cdn.builder.io/api/v1/image/assets/TEMP/6a53713129e933f7c8d0f0a243eb630a9643f7ec?placeholderIfAbsent=true&apiKey=4d86e9992856436e99337ef794fe12ef"
          placeholder={people ? `${people}명` : "인원 수를 선택 해주세요."}
          iconAlt="People icon"
          />
        </div>
        {activeSelector === 'people' && (
          <PersonCountSelector
          people={people}
          setPeople={setPeople}
          />
        )}

        <Button 
          type="button"
          onClick={handleSearch}
          className="flex flex-col justify-center items-center w-full h-[45px] text-center text-white bg-cpurple"
        >
          <div className="flex gap-2.5 items-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" class="size-4 object-contain shrink-0 self-stretch my-auto w-6 aspect-square">
              <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
            </svg>
            <span className="leading-none">검색하기</span>
          </div>
        </Button>

      </div>
    </form>
  );
}
