import React from "react";

const ReservationDetails = () => {
  return (
    <section className="flex flex-col gap-6 items-start self-stretch py-0 pr-4 pl-9 max-md:px-4 max-md:py-0 max-sm:p-0">
      <article className="flex flex-col gap-3 items-start p-6 bg-white rounded-md border border-solid border-zinc-200 w-[612px] max-md:w-full max-sm:p-4">
  
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/dd9828108ede19b4b6853e150638806bd7022c50?placeholderIfAbsent=true"
          alt="Reservation image"
          className="shrink-0 rounded-md h-[142px] w-[117px] max-sm:object-cover max-sm:w-full max-sm:h-[200px]"
        />
        <div className="flex flex-col flex-1 gap-1.5 py-2.5 pr-1.5 pl-4 max-sm:p-0">
          <p className="px-2.5 py-0 text-sm leading-5 text-black">
            글램핑 캠핑존 (1박) / 김캠핑
          </p>
          <p className="px-2.5 py-0 text-xs leading-5 text-black">
            위치 : 서울시 성동구 캠핑로 123
          </p>
          <p className="px-2.5 py-0 text-xs leading-5 text-black">
            이용 예정일 : 2025.05.20 ~ 2025.05.21
          </p>
          <p className="px-2.5 py-0 text-xs leading-5 text-black">
            결제 금액 : ₩ 89,000
          </p>
        </div>
      </article>
    </section>
  );
};

export default ReservationDetails;
