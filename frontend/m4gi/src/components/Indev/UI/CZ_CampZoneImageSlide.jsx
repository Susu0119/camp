import React, { useEffect, useRef } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Pagination, Autoplay } from "swiper/modules";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css";

export default function CZCampZoneImageSlide({ zoneImageJson }) {
  if(!zoneImageJson) return null;

  let imageList = [];

  try {
      const parsed = JSON.parse(zoneImageJson);
      const thumbnail = parsed.thumbnail?.[0];
      const detailImages = parsed.detail || [];
      
      console.log("thumbnailImage", thumbnail);
      console.log("detailImages", detailImages);

      if(thumbnail) {
        imageList.push(thumbnail);
      }
      imageList = [...imageList, ...detailImages];
  } catch (err) {
      console.error("zoneImage JSON 파싱 오류 발생: ", err);
      return null;
  }

  if(imageList.length === 0) return null;
  
  return (
    <div className="w-full aspect-[2.75] rounded-xl overflow-hidden">
        <Swiper
          modules = {[Navigation, Pagination, Autoplay]}
          navigation
          pagination = {{ clickable: true }}
          scrollbar = {{ draggable: true }}
          autoplay = {{  delay: 4000, disableOnInteraction: true }}
          loop = {true}
          className="rouneded-md"
        >
        {imageList.map((url, idx) => (
          <SwiperSlide key = {idx}>
            <img 
              src={url}
              alt={`캠핑장 구역 이미지 ${idx + 1}`} 
              className="w-full h-[350px] md:h-[500px] object-cover rounded-md" 
            />
          </SwiperSlide>
        ))}
        </Swiper>
    </div>
  );
}


