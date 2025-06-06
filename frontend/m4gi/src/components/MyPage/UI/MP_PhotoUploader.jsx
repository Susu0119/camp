"use client";
import React, { useRef, useState } from "react";
import FormField from "./MP_FormField";

const PhotoUploader = () => {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [showAlert, setShowAlert] = useState(false);

  const handleButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    // 현재 선택된 파일과 새로 추가하려는 파일 합쳐서 3장 넘는지 체크
    if (selectedFiles.length + files.length > 3) {
      setShowAlert(true);
      e.target.value = ""; // input 초기화
      return;
    }
    // 누적해서 최대 3장까지만 저장
    setSelectedFiles((prev) => [...prev, ...files].slice(0, 3));
    e.target.value = ""; // input 초기화 (같은 파일 재선택 가능하도록)
  };

  const handleRemove = (index) => {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <FormField label="사진 선택" labelClassName="text-left w-full">
      <div className="w-full max-w-[750px] flex flex-col gap-3">
        <button
          type="button"
          onClick={handleButtonClick}
          className="flex flex-col gap-2 items-center p-6 rounded-md border-2 border-dashed border-gray-300 w-full cursor-pointer hover:border-fuchsia-700 transition-colors duration-200"
        >
          <svg
            width="33"
            height="32"
            viewBox="0 0 33 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="upload-icon"
            style={{ width: "32px", height: "32px" }}
          >
            <path
              d="M28.5 16V25.3333C28.5 26.0406 28.219 26.7189 27.719 27.219C27.2189 27.719 26.5406 28 25.8333 28H7.16667C6.45942 28 5.78115 27.719 5.28105 27.219C4.78095 26.7189 4.5 26.0406 4.5 25.3333V6.66667C4.5 5.95942 4.78095 5.28115 5.28105 4.78105C5.78115 4.28095 6.45942 4 7.16667 4H16.5"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M21.8333 6.66699H29.8333"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M25.8333 2.66699V10.667"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M12.4999 14.6663C13.9727 14.6663 15.1666 13.4724 15.1666 11.9997C15.1666 10.5269 13.9727 9.33301 12.4999 9.33301C11.0272 9.33301 9.83325 10.5269 9.83325 11.9997C9.83325 13.4724 11.0272 14.6663 12.4999 14.6663Z"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
            <path
              d="M28.5 19.9999L24.3853 15.8853C23.8853 15.3853 23.2071 15.1045 22.5 15.1045C21.7929 15.1045 21.1147 15.3853 20.6147 15.8853L8.5 27.9999"
              stroke="#71717A"
              strokeWidth="2.66667"
              strokeLinecap="round"
              strokeLinejoin="round"
            ></path>
          </svg>
          <span className="text-sm leading-5 text-center text-zinc-500 max-sm:text-xs">
            클릭하여 사진 업로드 (최대 3장 선택 가능)
          </span>
        </button>

        {/* 썸네일 미리보기 및 삭제 버튼 */}
        {selectedFiles.length > 0 && (
          <div className="flex gap-4 flex-wrap">
            {selectedFiles.map((file, idx) => {
              const objectUrl = URL.createObjectURL(file);
              return (
                <div key={idx} className="relative w-20 h-20 rounded-md overflow-hidden border border-gray-300">
                  <img
                    src={objectUrl}
                    alt={`선택된 이미지 ${idx + 1}`}
                    className="w-full h-full object-cover"
                    onLoad={() => URL.revokeObjectURL(objectUrl)}
                  />
                  <button
                    type="button"
                    onClick={() => handleRemove(idx)}
                    className="absolute top-0 right-0 bg-black bg-opacity-50 text-white rounded-bl-md px-1 text-xs"
                    aria-label="사진 삭제"
                  >
                    ×
                  </button>
                </div>
              );
            })}
          </div>
        )}

        {/* 모달 경고 */}
        {showAlert && (
        <div className="absolute ">
          <div className="bg-white rounded-md p-5 max-w-xs w-full text-center shadow-lg border border-gray-300">
            <p className="mb-4 text-gray-700">사진은 최대 3장까지 업로드 가능합니다.</p>
            <button
              onClick={() => setShowAlert(false)}
              className="px-4 py-2 bg-fuchsia-700 text-white rounded hover:bg-fuchsia-800 transition"
            >
              확인
            </button>
          </div>
        </div>
      )}
        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </FormField>
  );
};

export default PhotoUploader;
