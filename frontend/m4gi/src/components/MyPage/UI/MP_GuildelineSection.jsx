import React from "react";

const GuidelinesSection = () => {
  return (
    <section className="flex flex-col gap-6 items-start self-stretch py-0 pr-4 pl-9 max-md:px-4 max-md:py-0 max-sm:p-0">
      <article className="flex flex-col gap-3 items-start p-6 bg-white rounded-md border border-solid border-zinc-200 w-[612px] max-md:w-full max-sm:p-4">
        <h2 className="text-2xl font-bold leading-5 text-black max-sm:text-lg">
          안내사항
        </h2>
        <div className="flex flex-col gap-5 justify-center items-start self-stretch px-4 pt-2.5 pb-2.5 bg-white rounded-md border border-solid border-zinc-200 h-[180px]">
          <p className="text-sm leading-5 text-center text-zinc-500">
            예약 취소는 [나의 예약] 페이지 내 [예약 취소]에서 직접 진행하실 수 있습니다.
          </p>
          <p className="text-sm leading-5 text-center text-zinc-500">
            취소 사유를 선택하거나 직접 작성하실 수 있으며, 예약 취소가 완료되면 확인 알림이 발송됩니다.
          </p>
          <p className="text-sm leading-5 text-center text-zinc-500">
            예약 취소 시, 아래 환불 규정이 적용되오니 확인 후 진행해 주시기 바랍니다.
          </p>
        </div>
      </article>
    </section>
  );
};

export default GuidelinesSection;
