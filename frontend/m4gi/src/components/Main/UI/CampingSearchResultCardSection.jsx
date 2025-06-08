import React from "react";
import CampingCard from "../UI/LazyImageCard";

export default function CampingSearchResultCardSection ({ campingData }) {
    if (campingData.length === 0) {
        return <p className="text-center m-60 select-none text-gray-500">검색 결과가 없습니다.</p>;
    }

  return (
    <section className="grid gap-5 grid-cols-4 w-full justify-items-center mx-auto mt-3">
      {campingData.map(camp => (
        <CampingCard
            key={camp.campgroundId}
            site={{
                id: camp.campgroundId,
                name: camp.campgroundName,
                location: `${camp.addrSido} ${camp.addrSigungu}`,
                type: camp.campgroundTypeString,
                score: camp.reviewRatingAvg,
                price: camp.campgroundPrice || 0,
                remainingSpots: camp.totalCurrentStock || 0,
                image: JSON.parse(camp.campgroundImage)?.url,
                isNew: false,
                isWishlisted: camp.isWishlisted === 1,
            }}
            className="w-full h-full flex justify-center items-center"
            variant="small"
        />
      ))}
    </section>
  );
};
