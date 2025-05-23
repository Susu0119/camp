"use client";
import React, { useState, useEffect } from "react";
import axios from 'axios'; // ⬅️ 1. axios를 import 합니다.
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
  price: "40,000",
  remainingSpots: 4,
  image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6b21b804914c0c9f7786ebc82550e078fd82efad?placeholderIfAbsent=true",
};

const siteB = {
  name: "캠핑 B동",
  price: "40,000",
  remainingSpots: 4,
  image: "https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/6b21b804914c0c9f7786ebc82550e078fd82efad?placeholderIfAbsent=true",
};

export default function CampDetailPage() {
  const [mainCampgroundImage, setMainCampgroundImage] = useState(null);
  // const [loading, setLoading] = useState(true); // 로딩 상태 (선택 사항)
  // const [error, setError] = useState(null); // 에러 상태 (선택 사항)

  useEffect(() => {
    const fetchCampgroundImage = async () => {
      const campgroundId = "CAMP_0001"; // 요청할 캠핑장 ID
      try {
        const response = await axios.get(`/web/api/campgrounds/${campgroundId}`);
        const data = response.data;

        console.log("API 응답 전체 (response.data):", data); // 전체 데이터 확인용 (유지해도 좋음)

        // 🔽 키 이름을 data.campground_image 로 수정합니다.
        if (data && data.campground_image && typeof data.campground_image === 'string') {
          try {
            // 🔽 data.campground_image 로 수정
            const imageObject = JSON.parse(data.campground_image); // JSON 문자열 파싱
            if (imageObject && imageObject.url) {
              setMainCampgroundImage(imageObject.url); // 실제 URL 설정
            } else {
              console.warn("campground_image JSON 객체에 'url' 속성이 없습니다.", imageObject);
              setMainCampgroundImage(null);
            }
          } catch (parseError) {
            // 🔽 data.campground_image 로 수정
            console.error("campground_image JSON 파싱에 실패했습니다:", parseError, "원본 값:", data.campground_image);
            setMainCampgroundImage(null);
          }
        } else {
          // 🔽 data.campground_image 로 수정 (경고 메시지 부분도)
          console.warn("조건 불충족: campground_image를 API 응답에서 찾을 수 없거나 문자열이 아닙니다.", data ? `받은 값: ${data.campground_image}, 타입: ${typeof data.campground_image}` : 'data 객체가 null임');
          setMainCampgroundImage(null);
        }
      } catch (err) {
        console.error("캠핑장 이미지 정보를 가져오는 데 실패했습니다 (axios):", err);
        if (err.response) {
          console.error("Error data:", err.response.data);
          console.error("Error status:", err.response.status);
        } else if (err.request) {
          console.error("Error request:", err.request);
        } else {
          console.error("Error message:", err.message);
        }
        setMainCampgroundImage(null);
      }
    };

    fetchCampgroundImage();
  }, []);

  return (
    <main className="flex overflow-hidden flex-col bg-white">
      <Header />
      <section className="flex-1 px-20 py-12 w-full max-md:px-5 max-md:max-w-full">
        <figure className="flex gap-2.5 items-center p-2.5 w-full rounded-xl max-md:max-w-full">
          <img
            src={mainCampgroundImage}
            className="object-contain flex-1 shrink self-stretch my-auto w-full rounded-xl aspect-[2.75] basis-0 min-w-60 max-md:max-w-full"
            alt="캠핑장 전경"
          />
        </figure>
        <article className="flex-1 px-10 mt-2.5 w-full max-md:px-5 max-md:max-w-full">
          <CampSiteInfo />
          <AmenitiesList />
          <Divider className="mt-8" />
          <SiteDescription />
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
            <Card site={siteB} variant='long' />
            <CampSiteAttribute
              type="캠핑"
              maxPeople={6}
              deckType="데크"
              size="5 x 6 m"
            />
          </section>
          <Divider className="mt-8" />
          <ReviewSection />
        </article>
      </section>
    </main>
  );
}