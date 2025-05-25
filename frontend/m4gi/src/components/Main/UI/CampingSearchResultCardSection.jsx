import React from "react";
import CampingCard from "./Card";

export default function CampingSearchResultCardSection ({ campingData }) {
    if (campingData.length === 0) {
        return <p className="text-center mt-10 text-gray-500">검색 결과가 없습니다.</p>;
    }

  return (
    <section className="grid gap-5 grid-cols-4 w-full justify-items-center mx-auto mt-3 cursor-pointer">
      {campingData.map(camp => (
        <CampingCard
            site={{
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
        />
      ))}
    </section>
  );
};
