import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import CampNameInput from "./CampNameInput.jsx";
import SearchInput from "./SearchInput.jsx";
import RegionSelector from "./RegionSelector.jsx";
import Calendar from "../../Indev/UI/Calendar.jsx";
import PersonCountSelector from "./PersonCountSelector.jsx";
import SearchButton from "./SearchButton.jsx"; // 본래 사용하던 버튼
import { Button } from "../../Common/Button.jsx" // 추후 수정할 버튼

export default function SearchForm() {
  // 페이지 이동
  const navigate = useNavigate(); 

  // ★ 지역, 날짜, 인원수 검색 바 클릭 시 Selector 표시용 상태 ('region', 'date', 'people', 또는 null)
  const [activeSelector, setActiveSelector] = useState(null);

  // 특정 Selector 선택기 토글 함수
  const handleSelectorToggle = (selectorName) => {
    console.log('handleSelectorToggle 호출됨. selectorName:', selectorName); // 디버깅
    setActiveSelector(prevActiveSelector => {
      const newActiveSelector = prevActiveSelector === selectorName ? null : selectorName;
      console.log('New activeSelector state:', newActiveSelector); // 디버깅
      return newActiveSelector;
    });
  };
  
  // ★ 검색 결과 페이지 url에 담아갈 내용들 변환 및 페이지 이동
  const [campgroundName, setCampgroundName] = useState("");
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
  const handleSearch = async () => {
    const params = new URLSearchParams();
    if(campgroundName) params.append("campgroundName", campgroundName);
    if (addrSigunguList.length > 0) {
      addrSigunguList.forEach(sigungu => {
        params.append("addrSigunguList", sigungu);
      });
    }
    if(startDate) params.append("startDate", startDate);
    if(endDate) params.append("endDate", endDate);
    params.append("people", people.toString());
    params.append("providerCode", "1");           // 추후 수정 예정 (user provideCode) - 위시리스트 추가 여부 판단을 위해 임시로 추가되어 있음
    params.append("providerUserId", "puid_0001");    // 추후 수정 예정 (user providerUserId) - 위시리스트 추가 여부 판단을 위해 임시로 추가되어 있음
    
    try {
      const response = await axios.get(`/web/api/campgrounds/searchResult?${params.toString()}`);
      const data = response.data;

      // 확인용 코드
      // console.log("📦 응답 데이터 길이:", response.data.length);
      // console.log("📦 페이지 이동 직전 데이터:", data);

      // 검색 결과 가지고 페이지 이동
      navigate("/searchResult", {
        state: {
          searchResults: data,
          searchParams: Object.fromEntries(params.entries()),
        }
      });
    } catch (err) {
      if(err.response?.status === 204) {
        alert("검색 결과가 없습니다.");
      }
      else {
        alert("검색 중 오류가 발생하였습니다.");
      }
    }
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
            console.log('Region selector div clicked'); // 클릭 이벤트 발생 확인
            handleSelectorToggle('region');
          }}
          className="cursor-pointer" 
          role="button" tabIndex={0} 
          onKeyDown={(e) => e.key === 'Enter' && handleSelectorToggle('region')}
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
            console.log('Date selector div clicked'); // 클릭 이벤트 발생 확인
            handleSelectorToggle('date');
          }}
          className="cursor-pointer" 
          role="button" tabIndex={0} 
          onKeyDown={(e) => e.key === 'Enter' && handleSelectorToggle('region')}
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
            console.log('Date selector div clicked'); // 클릭 이벤트 발생 확인
            handleSelectorToggle('people');
          }}
          className="cursor-pointer" 
          role="button" tabIndex={0} 
          onKeyDown={(e) => e.key === 'Enter' && handleSelectorToggle('region')}
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
        
        {/* 버튼 -> searchResult 페이지로 */}
        <SearchButton onClick={handleSearch} />

      </div>
    </form>
  );
}
