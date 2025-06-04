import React from 'react';

const ProductInfo = ({
  campgroundName,
  siteName,
  checkinDate,
  checkinTime,
  checkoutDate,
  checkoutTime,
  price
}) => {
  return (
    <>
      <h2 className="self-stretch px-0 py-0.5 text-lg font-bold text-fuchsia-700 max-sm:text-base">
        상품 정보
      </h2>
      <section className="flex flex-col gap-1 items-start self-stretch px-4 pt-4 pb-5 bg-purple-200 rounded-md">
        <p className="text-base text-zinc-800 max-sm:text-sm">캠핑지: {campgroundName}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">캠핑 사이트 이름: {siteName}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">입실일: {checkinDate} - 입실 시간: {checkinTime}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">퇴실일: {checkoutDate} - 퇴실 시간: {checkoutTime}</p>
        <p className="text-base text-zinc-800 max-sm:text-sm">상품가격: {price.toLocaleString()} 원</p>
      </section>
    </>
  );
};

export default ProductInfo;
