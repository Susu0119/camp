import React, { useState } from "react";
import CancellationReasonDropdown from "./MP_CancellationDropdown";

const CancellationForm = () => {
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");

  const toggleReasons = () => {
    setShowReasons(!showReasons);
  };

  const selectReason = (reason) => {
    setSelectedReason(reason);
    setShowReasons(false);
  };

  return (
    <section className="flex gap-6 items-start self-stretch py-0 pr-4 pl-9 max-md:px-4 max-md:py-0 max-sm:p-0">
      <div className="flex flex-col gap-3 items-start p-6 bg-white rounded-md border border-solid border-zinc-200 w-[612px] max-md:w-full max-sm:p-4">
        <h2 className="text-2xl font-bold leading-5 text-black max-sm:text-lg">
          취소 사유
        </h2>
        <div className="flex flex-col gap-2 items-start self-stretch">
          <CancellationReasonDropdown
            showReasons={showReasons}
            toggleReasons={toggleReasons}
            selectedReason={selectedReason}
            selectReason={selectReason}
          />
        </div>
        <textarea
          placeholder="취소 사유를 15자 이상 작성해주세요."
          value={additionalInfo}
          onChange={(e) => setAdditionalInfo(e.target.value)}
          className="gap-6 self-stretch px-4 pt-2.5 pb-2.5 text-sm bg-white rounded-md border border-solid border-zinc-200 h-[65px] text-stone-700 placeholder:text-stone-300 resize-none"
        />
      </div>
    </section>
  );
};

export default CancellationForm;
