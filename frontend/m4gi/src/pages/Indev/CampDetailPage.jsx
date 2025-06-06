// CampDetailPage.jsx
import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiCore } from "../../utils/Auth";
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

export default function CampDetailPage() {
  const { campgroundId } = useParams();
  const navigate = useNavigate();
  const [campgroundData, setCampgroundData] = useState(null);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [people, setPeople] = useState(2); // 기본값 2명

  // 캠핑장 데이터 가져오기 함수
  const CampgroundData = async (start = null, end = null) => {
    try {
      let url = `/api/campgrounds/${campgroundId}`;
      const params = new URLSearchParams();

      if (start && end) {
        params.append('startDate', start);
        params.append('endDate', end);
      }

      if (params.toString()) {
        url += `?${params.toString()}`;
      }


      const response = await apiCore.get(url);
      const data = response.data;


      setCampgroundData(data);
    } catch (err) {
      setCampgroundData(null);
    }
  };

  // 예약하기 버튼 클릭 핸들러
  const handleReservationClick = (zoneId) => {

    // CampZoneDetailPage로 이동하면서 URL 파라미터로 정보 전달
    navigate(`/detail/${campgroundId}/${zoneId}?startDate=${startDate}&endDate=${endDate}&people=${people}`);
  };

  // 컴포넌트 마운트 시 기본 데이터 로드
  useEffect(() => {
    CampgroundData();
  }, [campgroundId]);

  // 날짜가 변경될 때마다 데이터 다시 로드
  useEffect(() => {
    if (startDate && endDate) {
      CampgroundData(startDate, endDate);
    }
  }, [startDate, endDate]);

  // 이미지 URL을 campgroundData에서 직접 추출
  const CampgroundImage = campgroundData
    ? JSON.parse(campgroundData.campground.campground_image).url // null 체크 후 바로 파싱 및 URL 접근
    : null; // campgroundData가 null일 경우 null

  // campgroundZones에서 zone_image의 thumbnail 추출하는 함수
  const zoneImage = (zoneImageJson) => {
    if (!zoneImageJson) return null;
    try {
      const parsed = JSON.parse(zoneImageJson);
      return parsed.thumbnail?.[0] || null;
    } catch (error) {
      return null;
    }
  };

  // 캠핑 유형 영어 -> 한글 변환
  const translateZoneType = (type) => {
    const map = {
      tent: "캠핑",
      glamping: "글램핑",
      auto: "오토캠핑",
      caravan: "카라반",
      campnic: "캠프닉"
    };
    return map[type] || type;
  };

  // 지형 유형 영어 -> 한글 변환  
  const translateTerrainType = (type) => {
    const map = {
      Grass: "잔디/흙",
      Deck: "데크",
      Gravel: "자갈/파쇄석",
      Sand: "모래",
      Mixed: "혼합",
      Other: "기타"
    };
    return map[type] || type;
  };

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
          <SiteDescription campgroundData={campgroundData} />
          <section className="mt-8 w-full max-md:max-w-full">
            <h2 className="gap-2.5 p-2.5 w-full text-2xl font-bold text-neutral-900 max-md:max-w-full">
              상품 예약
            </h2>
            <Calendar setStartDate={setStartDate} setEndDate={setEndDate} />
            <DatePersonSelector
              setPeople={setPeople}
              startDate={startDate}
              endDate={endDate}
              people={people}
            />
          </section>
          <section className="mt-8 w-full max-md:max-w-full">
            {campgroundData && campgroundData.campgroundZones && campgroundData.campgroundZones.map((zone, index) => {
              const thumbnailImage = zoneImage(zone.zone_image);
              const siteData = {
                name: zone.zone_name,
                price: zone.default_weekday_price, // 실제 가격 데이터가 필요
                remainingSpots: zone.remaining_spots, // 실제 예약 가능 사이트 개수가 필요
                image: thumbnailImage,
              };

              return (
                <div key={zone.zone_id}>
                  <Card
                    site={siteData}
                    variant='long'
                    startDate={startDate}
                    endDate={endDate}
                    people={people}
                    onReservationClick={() => handleReservationClick(zone.zone_id)}
                  />
                  <CampSiteAttribute
                    type={translateZoneType(zone.zone_type)}
                    maxPeople={zone.capacity}
                    deckType={translateTerrainType(zone.zone_terrain_type)}
                    size="5 x 6 m" // 기본값 - 실제로는 사이트 크기 정보 필요
                  />
                </div>
              );
            })}
          </section>
          <Divider className="mt-8" />
          <ReviewSection campgroundData={campgroundData} />
        </article>
      </section>
    </main>
  );
}