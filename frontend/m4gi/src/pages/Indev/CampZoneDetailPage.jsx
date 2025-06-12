// CampDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { apiCore } from "../../utils/Auth";
import { useParams } from "react-router-dom";
import Header from "../../components/Common/Header";
import CampZoneInfo from "../../components/Indev/UI/CZ_CampZoneInfo";
import ReviewSection from "../../components/Indev/UI/ReviewSection";
import CampZoneDescription from "../../components/Indev/UI/CZ_CampZoneDescription";
import CampZoneImageSlide from "../../components/Indev/UI/CZ_CampZoneImageSlide";
import CampMapSection from "../../components/Indev/UI/CampMapSection";
import SiteSelectionSection from "../../components/Indev/UI/CZ_SiteSelectionSection";

export default function CampZoneDetailPage() {
  const { campgroundId, zoneId } = useParams();
  const [zoneSiteData, setZoneSiteData] = useState();
  const [mapImageURL, setMapImageURL] = useState();
  const [availableSiteIds, setAvailableSiteIds] = useState([]);
  
  // 캠핑장 상세 페이지에서 예약 정보 URL에서 가져오기
  // URL 예시: /detail/${campgroundId}/${zoneId}?startDate=${startDate}&endDate=${endDate}&people=${people}
  const [searchParams] = useSearchParams();
  const startDate = searchParams.get("startDate");
  const endDate = searchParams.get("endDate");
  const people = Number(searchParams.get("people")) || 2; 

  // 처음 페이지 진입 시, 페이지 상단이 보이도록
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // 데이터 가져오기 - 해당 구역 정보, 구역 내 사이트 정보, 구역 리뷰 정보
  useEffect(() => {
    const getZoneSiteData = async () => {
      try {
        // startDate가 있는 경우 성수기 정보 포함하여 요청
        const url = startDate 
          ? `/api/campgrounds/${campgroundId}/zones/${zoneId}?startDate=${startDate.replace(/\./g, '-')}`
          : `/api/campgrounds/${campgroundId}/zones/${zoneId}`;
          
        const response = await apiCore.get(url);
        const data = response.data;

        setZoneSiteData(data);

      } catch (err) {
        console.error("구역, 사이트 정보를 가져오는 데 실패했습니다 (apiCore):", err);
        setZoneSiteData(null);
      }
    };

    getZoneSiteData();
  }, [campgroundId, zoneId, startDate]);

  // 데이터 가져오기 - 캠핑장 지도 이미지 URL
  useEffect(() => {
    const getCampgroundMapImg = async () => {
      try {
        const response = await apiCore.get(`/api/campgrounds/${campgroundId}/map-image`);
        setMapImageURL(response.data);
      } catch (err) {
        console.error("캠핑장 지도 URL을 가져오는데 실패했습니다 (apiCore):", err);
      }
    }
    getCampgroundMapImg();
  }, [campgroundId]);

  // 데이터 가져오기 - 예약 가능한 사이트 List<String>
  useEffect(() => {
    const zoneIdToUse = zoneSiteData?.zoneId;
    if (!zoneIdToUse || !startDate || !endDate) return;

    const getAvailableSites = async () => {
      try {
        const response = await apiCore.get(`/api/zones/${zoneSiteData.zoneId}/available-sites`,{
          params: {
            startDate,
            endDate,
          },
        });
        setAvailableSiteIds(response.data);
      } catch (err) {
        console.error("예약 가능 사이트 가져오기 실패(apiCore):", err);
      }
    };
    getAvailableSites();
  }, [zoneSiteData?.zoneId, startDate, endDate]);

  

  return (
    <main className = "flex overflow-hidden flex-col bg-white">
      <Header />
      <section className = "flex-1 px-20 py-12 w-full max-md:px-5">
        <figure className = "w-full rounded-xl overflow-hidden">
          <CampZoneImageSlide zoneImageJson={zoneSiteData?.zoneImage} />
        </figure>
        <article className = "flex-1 mt-2.5 w-full max-md:px-2.5">
          <CampZoneInfo zoneSiteData = {zoneSiteData} />
          <CampZoneDescription zoneSiteData = {zoneSiteData} />
          <CampMapSection mapImageUrl = {mapImageURL}/>
          <SiteSelectionSection 
            zoneSiteData = {zoneSiteData} 
            availableSiteIds = {availableSiteIds}
            startDate={startDate}
            endDate={endDate}
            people={people}
          />
          <ReviewSection zoneData = {zoneSiteData} />
        </article>
      </section>
    </main>
  );
}