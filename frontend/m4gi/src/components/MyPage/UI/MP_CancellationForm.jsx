import React, { useState } from "react";
import CancellationReasonDropdown from "./MP_CancellationDropdown";

const CancellationForm = () => {
  const [showReasons, setShowReasons] = useState(false);
  const [selectedReason, setSelectedReason] = useState("");

  const toggleReasons = () => {
    setShowReasons((prev) => !prev);
  };

  const selectReason = (reason) => {
    setSelectedReason(reason);
    setShowReasons(false);
  };

  return (
    <section className="flex gap-6 items-start py-0 pr-4 pl-9 max-md:px-4 max-sm:p-0 w-full">
      <div className="flex flex-col gap-3 items-start p-4 bg-white rounded-md border border-solid border-zinc-200 w-full max-md:w-full max-sm:p-4">
        <h2 className="text-2xl font-bold leading-5 text-black max-sm:text-lg">
          취소 사유
        </h2>
        <div className="flex flex-col gap-2 items-start self-stretch w-full">
          <CancellationReasonDropdown
            showReasons={showReasons}
            toggleReasons={toggleReasons}
            selectedReason={selectedReason}
            selectReason={selectReason}
          />
        </div>
      </div>
    </section>
  );
};

export default CancellationForm;
