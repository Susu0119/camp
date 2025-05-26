// CampDetailPage.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import Header from "../../components/Common/Header";
import CampSiteInfo from "../../components/Indev/UI/CampSiteInfo";
import CampSiteAttribute from "../../components/Indev/UI/CampSiteAttribute";
import AmenitiesList from "../../components/Indev/UI/AmenityList";
import SiteDescription from "../../components/Indev/UI/SiteDescription";
import Calendar from "../../components/Indev/UI/Calendar";
import DatePersonSelector from "../../components/Indev/UI/DatePersonSelector";
import ReviewSection from "../../components/Indev/UI/ReviewSection";
import Divider from "../../components/Indev/UI/Divider";
import Card from "../../components/Main/UI/Card";

const siteA = {
  name: "캠핑 A동",
  price: "40000",
  remainingSpots: 4,
  image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6b21b804914c0c9f7786ebc82550e078fd82efad?placeholderIfAbsent=true",
};

const siteB = {
  name: "캠핑 B동",
  price: "40000",
  remainingSpots: 4,
  image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6b21b804914c0c9f7786ebc82550e078fd82efad?placeholderIfAbsent=true",
};

export default function CampDetailPage() {
  const [campgroundData, setCampgroundData] = useState(null);

  useEffect(() => {
    const CampgroundData = async () => {
      const campgroundId = "CAMP_0001";
      try {
        const response = await axios.get(`/web/api/campgrounds/${campgroundId}`);
        const data = response.data;

        setCampgroundData(data); // 모든 데이터를 하나의 상태에 저장

      } catch (err) {
        console.error("캠핑장 정보를 가져오는 데 실패했습니다 (axios):", err);
        setCampgroundData(null); // 에러 발생 시 데이터 초기화
      }
    };

    CampgroundData();
  }, []);

  // 이미지 URL을 campgroundData에서 직접 추출
  const CampgroundImage = campgroundData
    ? JSON.parse(campgroundData.campground.campground_image).url // null 체크 후 바로 파싱 및 URL 접근
    : null; // campgroundData가 null일 경우 null

  return (
    <main className="flex overflow-hidden flex-col bg-white">
      <Header />
      <section className="flex-1 px-20 py-12 w-full max-md:px-5 max-md:max-w-full">
        <figure className="flex gap-2.5 items-center p-2.5 w-full rounded-xl max-md:max-w-full">
          <img
            // ✨ mainCampgroundImageSrc 변수 사용
            src={CampgroundImage}
            className="object-fill flex-1 shrink self-stretch my-auto w-full rounded-xl aspect-[2.75] basis-0 min-w-60 max-md:max-w-full"
            alt="캠핑장 전경"
          />
        </figure>
        <article className="flex-1 px-10 mt-2.5 w-full max-md:px-5 max-md:max-w-full">
          <CampSiteInfo campgroundData={campgroundData} />
          <AmenitiesList campgroundData={campgroundData} />
          <Divider className="mt-8" />
          <SiteDescription campgroundData={campgroundData}/>
          <section className="mt-8 w-full max-md:max-w-full">
            <h2 className="gap-2.5 p-2.5 w-full text-2xl font-bold text-neutral-900 max-md:max-w-full">
              상품 예약
            </h2>
            <Calendar />
            <DatePersonSelector />
          </section>
          <section className="mt-8 w-full max-md:max-w-full">
            <Card site={siteA} variant='long' />
            <CampSiteAttribute
              type="캠핑"
              maxPeople={6}
              deckType="데크"
              size="5 x 6 m"
            />
            <Card site={siteB} variant='long'/>
            <CampSiteAttribute
              type="캠핑"
              maxPeople={6}
              deckType="데크"
              size="5 x 6 m"
            />
          </section>
          <Divider className="mt-8" />
          <ReviewSection campgroundData={campgroundData} />
        </article>
      </section>
    </main>
  );
}