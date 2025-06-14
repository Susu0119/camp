import React from "react";
import CampingCard from "../UI/LazyImageCard";
import { translateType } from "../../../utils/Translate";

export default function CampingSearchResultCardSection({ campingData }) {
  if (campingData.length === 0) {
    return <p className="text-center m-60 select-none text-gray-500">검색 결과가 없습니다.</p>;
  }

  return (
    <section className="min-w-[1400px] max-[393px]:min-w-0 grid gap-5 grid-cols-4 justify-items-center mx-auto mt-3">
      {campingData.map(camp => (
        <CampingCard
          key={camp.campgroundId}
          site={{
            id: camp.campgroundId,
            name: camp.campgroundName,
            location: `${camp.addrSido} ${camp.addrSigungu}`,
            type: translateType(camp.campgroundType),
            score: (Math.round((parseFloat(camp.reviewRatingAvg) || 0) * 10) / 10).toFixed(1),
            price: camp.campgroundPrice || 0,
            remainingSpots: camp.totalCurrentStock || 0,
            image: camp.campgroundImage,
            isNew: false,
            isWishlisted: camp.isWishlisted === 1,
          }}
          className="flex justify-center items-center"
          variant="small"
        />
      ))}
    </section>
  );
};
