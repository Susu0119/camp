// CampDetailPage.jsx
import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useParams } from "react-router-dom";
import Header from "../../components/Common/Header";
import CampZoneInfo from "../../components/Indev/UI/CZ_CampZoneInfo";
import ReviewSection from "../../components/Indev/UI/CZ_CampZoneReviewSection";
import SiteDescription from "../../components/Indev/UI/SiteDescription";
import CampZoneDescription from "../../components/Indev/UI/CZ_CampZoneDescription";
import CampZoneImageSlide from "../../components/Indev/UI/CZ_CampZoneImageSlide";
import CampMapSection from "../../components/Indev/UI/CampMapSection";
import SiteSelectionSection from "../../components/Indev/UI/CZ_SiteSelectionSection";

export default function CampZoneDetailPage() {
  const { campgroundId } = useParams();
  const { zoneId } = useParams();
  const [zoneSiteData, setZoneSiteData] = useState();
  const [mapImageURL, setMapImageURL] = useState();

  // 데이터 가져오기
  useEffect(() => {
    const getZoneSiteData = async () => {
      try {
        const response = await axios.get(`/web/api/zones/${zoneId}`);
        const data = response.data;

        setZoneSiteData(data);

      } catch (err) {
        console.error("구역, 사이트 정보를 가져오는 데 실패했습니다 (axios):", err);
        setZoneSiteData(null);
      }
    };

    getZoneSiteData();
  }, [campgroundId, zoneId]);

  // 데이터 가져오기 - 캠핑장 지도 이미지 URL
  useEffect(() => {
    const getCampgroundMapImg = async () => {
      try {
        const response = await axios.get(`/web/api/campgrounds/${campgroundId}/map-image`);
        setMapImageURL(response.data);
      } catch (err) {
        console.error("캠핑장 지도 URL을 가져오는데 실패했습니다 (axios):", err);
      }
    }
    getCampgroundMapImg();
  }, [campgroundId]);

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
          <SiteSelectionSection zoneSiteData = {zoneSiteData} />
          <ReviewSection zoneData = {zoneSiteData} />
        </article>
      </section>
    </main>
  );
}