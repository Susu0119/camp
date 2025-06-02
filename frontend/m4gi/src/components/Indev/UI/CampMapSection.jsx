import React, {useState} from "react";

export default function CampMapSection({ mapImageUrl }) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="w-full my-10">
      <h3 className="text-2xl text-cblack mb-4">캠핑장 지도</h3>

      {/* 지도 */}
      <div className="w-150 mx-auto">
        {mapImageUrl ? (
          <img  
            src = {mapImageUrl}
            alt = "캠핑장 지도"
            className = "w-full h-auto object-cover"
            onClick = {() => setIsModalOpen(true)}
          />
        ) : (
          <div className="aspect-[3/2] no-image mx-auto w-130 object-cover select-none">
            <span className="text-gray-500 text-sm">지도가 등록되지 않았습니다</span>
          </div>
        )}
      </div>

      {/* 지도 모달창 */}
      {isModalOpen &&(
        <div className="fixed inset-0 backdrop-blur bg-opacity-50 flex items-center justify-center z-50" onClick={() => setIsModalOpen(false)}>
          <div className="bg-white rounded-md shadow-lg p-4 relative max-w-[90%] max-h-[90%]" onClick={(e) => e.stopPropagation()}>
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-black text-2xl"
              onClick={() => setIsModalOpen(false)}
            >
              &times;
            </button>
            <img
              src={mapImageUrl}
              alt="확대된 캠핑장 지도"
              className="max-w-full max-h-[80vh] object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}
