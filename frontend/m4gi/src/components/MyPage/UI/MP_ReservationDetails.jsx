import React from "react";

const ReservationDetails = ({
  imageUrl = "https://cdn.builder.io/api/v1/image/assets/TEMP/dd9828108ede19b4b6853e150638806bd7022c50?placeholderIfAbsent=true",
  title = "예약 정보 없음",
  location = "",
  dates = "",
  amount = "",
}) => {
  return (
    <section className="flex justify-center px-4 py-6">
      <article className="flex flex-col sm:flex-row gap-6 w-full max-w-2xl bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        {/* 캠핑장 이미지 */}
        {/*<img
          src={imageUrl}
          alt="Reservation"
          className="w-full sm:w-40 h-auto rounded-md object-cover aspect-[3/4]"
        />*/}

        {/* 캠핑장 정보 */}
        <div className="flex flex-col gap-2 flex-1">
          <p className="text-base font-semibold text-black">{title}</p>
          {/*<p className="text-sm text-gray-700">📍 위치: {location}</p>*/}
          <p className="text-sm text-gray-700"> 이용 예정일: {dates}</p>
          {/*<p className="text-sm text-gray-700">💳 결제 금액: {amount}</p>*/}
        </div>
      </article>
    </section>
  );
};

export default ReservationDetails;
