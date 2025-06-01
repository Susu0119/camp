import React from "react";

export default function CampMapSection({ mapImageUrl }) {
  return (
    <section className="w-full my-10">
      <h3 className="text-xl font-semibold text-cblack mb-4">캠핑장 지도</h3>
      <div className="w-full mx-auto">
        <img
          src={mapImageUrl}
          alt="캠핑장 지도"
          className="w-full h-auto rounded-lg object-cover"
        />
      </div>
    </section>
  );
}
