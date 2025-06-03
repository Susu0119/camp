import React from "react";

const SubmitButton = () => {
  return (
    <div className="w-full p-2 mt-1 flex justify-center">
      <button
        className="h-10 px-4 py-2 text-sm font-bold leading-5 text-center text-neutral-50 bg-fuchsia-700 rounded-md w-full max-sm:text-xs"
      >
        작성 완료
      </button>
    </div>
  );
};

export default SubmitButton;
