import React from "react";

export default function CampMapSection({ mapImageUrl }) {
  return (
    <section className="w-full my-10">
      <h3 className="text-2xl text-cblack mb-4">캠핑장 지도</h3>
      <div className="w-200 mx-auto">
        {mapImageUrl ? (
          <img  
            src = {mapImageUrl}
            alt = "캠핑장 지도"
            className="w-full h-auto object-cover"
          />
        ) : (
          <div className="aspect-[3/2] no-image mx-auto w-130 object-cover select-none">
            <span className="text-gray-500 text-sm">지도가 등록되지 않았습니다</span>
          </div>
        )}
      </div>
    </section>
  );
}
