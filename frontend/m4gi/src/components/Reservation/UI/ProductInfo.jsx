import React from 'react';

const ProductInfo = () => {
  return (
    <>
      <h2 className="self-stretch px-0 py-0.5 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        상품 정보
      </h2>
      <section className="flex flex-col gap-1 items-start self-stretch px-4 pt-4 pb-5 bg-purple-200 rounded-md">
        <p className="text-base text-zinc-800 max-sm:text-sm">
          {/* {reservationData.campgroundName} */} 논산 수락베이스캠프
        </p>
        <p className="text-base text-zinc-800 max-sm:text-sm">
          {/* {reservationData.siteName} */} 글램핑 1호~4호/냉난방
        </p>
        <p className="text-base text-zinc-800 max-sm:text-sm">
          입실일: {/*{reservationData.checkinDate}*/} 2025.05.20 - 입실 시간 : {/*{reservationData.checkinTime}*/} 16:00
        </p>
        <p className="text-base text-zinc-800 max-sm:text-sm">
          퇴실일: {/*{reservationData.checkoutDate}*/} 2025.05.24 - 퇴실 시간 : {/*{reservationData.checkoutTime}*/} 퇴실 시간 : 13:00
        </p>
        
      </section>
    </>
  );
};

export default ProductInfo;
