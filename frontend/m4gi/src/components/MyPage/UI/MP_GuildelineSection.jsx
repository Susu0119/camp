import React from "react";

const GuidelinesSection = () => {
  return (
    <section className="flex justify-center px-4 py-6">
      <article className="w-full max-w-2xl bg-white rounded-xl border border-zinc-200 p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-black mb-4">안내사항</h2>

        {/* 이 div에 text-center 클래스를 추가했습니다. */}
        <div className="flex flex-col gap-3 bg-white border border-zinc-200 rounded-md p-4 text-center">
          {/*<p className="text-sm text-zinc-600 leading-relaxed">
            예약 취소는 [나의 예약] 페이지 내 [예약 취소]에서 직접 진행하실 수 있습니다.
          </p>*/}
          {/*<p className="text-sm text-zinc-600 leading-relaxed">
            취소 사유를 선택하거나 직접 작성하실 수 있으며, 예약 취소가 완료되면 확인 알림이 발송됩니다.
          </p>*/}
          <p className="text-sm text-zinc-600 leading-relaxed">
            예약 취소 시, 아래 환불 규정이 적용되오니 확인 후 진행해 주시기 바랍니다.
          </p>
        </div>
      </article>
    </section>
  );
};

export default GuidelinesSection;