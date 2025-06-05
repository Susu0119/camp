import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";

function AdminCampgroundModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) {
      const statusMap = {
        "운영중": 0,
        "휴무중": 1,
        "비활성화": 2,
      };

      const mappedStatus = statusMap[detail.status] ?? -1;

      console.log("🧾 detail 전체:", detail);
      console.log("🧪 원본 status:", detail.status);
      console.log("🧪 매핑된 status:", mappedStatus);
      console.log("🧪 typeof mappedStatus:", typeof mappedStatus);

      setLocalDetail({
        ...detail,
        status: Number(detail.status),
      });
    }
  }, [isOpen, detail]);

  useEffect(() => {
    if (isOpen && modalRef.current) {
      const modal = modalRef.current;
      const { innerWidth, innerHeight } = window;
      const { offsetWidth, offsetHeight } = modal;
      setPosition({
        x: (innerWidth - offsetWidth) / 2,
        y: (innerHeight - offsetHeight) / 2,
      });
    }
  }, [isOpen]);

  const getStatusLabelText = (s) => {
  switch (Number(s)) {
    case 0: return "운영중";
    case 1: return "휴무중";
    case 2: return "비활성화";
    default: return "알 수 없음";
  }
};
  const startDrag = (e) => {
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onDrag = (e) => {
    if (!dragging) return;
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const stopDrag = () => setDragging(false);

  const handleDeactivate = async () => {
    const result = await adminConfirm(
      "비활성화 처리",
      "정말 비활성화 처리하시겠습니까?",
      "네, 비활성화",
      "취소"
    );
    if (!result.isConfirmed) return;
    try {
      await axios.patch(`/web/admin/campgrounds/${localDetail.id}/deactivate`);
      await adminSuccess("캠핑장이 비활성화 처리되었습니다.", "완료!");
      if (refreshList) refreshList();
      onClose();
    } catch (err) {
      console.error("❌ 비활성화 실패:", err);
      await adminError("비활성화 처리에 실패했습니다.", "오류");
    }
  };
  
  const handleActivate = async () => {
    const result = await adminConfirm(
      "활성화 처리",
      "정말 이 캠핑장을 활성화할까요?",
      "네, 활성화",
      "취소"
    );
    if (!result.isConfirmed) return;
    try {
      await axios.patch(`/web/admin/campgrounds/${localDetail.id}/activate`);
      await adminSuccess("캠핑장이 다시 활성화되었습니다.", "완료!");
      if (refreshList) refreshList();
      onClose();
    } catch (err) {
      console.error("❌ 활성화 실패:", err);
      await adminError("활성화 처리에 실패했습니다.", "오류");
    }
  };  

  useEffect(() => {
  const handleKeyDown = (e) => {
    if (e.key === "Escape") {
      onClose();
    }
  };

  if (isOpen) {
    window.addEventListener("keydown", handleKeyDown);
  }

  return () => {
    window.removeEventListener("keydown", handleKeyDown);
  };
}, [isOpen, onClose]);

  const formatDate = (raw) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  };

  if (!isOpen || !localDetail) return null;

  const environmentTags = localDetail.environments?.split(',').map((env, idx) => (
    <span key={idx} className="inline-block bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
      {env.replaceAll('_', ' ')}
    </span>
  ));

  let imageUrl = null;
  try {
    imageUrl = localDetail.campgroundImage ? JSON.parse(localDetail.campgroundImage).url : null;
  } catch (e) {
    console.error("이미지 파싱 에러:", e);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-6 rounded-xl w-[600px] max-h-[80vh] overflow-y-auto shadow-lg absolute"
        style={{ left: `${position.x}px`, top: `${position.y}px`, cursor: "default" }}
      >
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-lg font-semibold">캠핑장 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>이름:</strong> {localDetail.name}</p>
          <p><strong>주소:</strong> {localDetail.addrFull}</p>
          <p><strong>연락처:</strong> {localDetail.phone}</p>
          <p><strong>유형:</strong> {localDetail.type}</p>
          <p><strong>상태:</strong> {getStatusLabelText(localDetail.status)}</p>

          <div>
            <strong className="block">운영 환경:</strong>
            <div className="pt-1 flex flex-wrap">{environmentTags}</div>
          </div>

          <div>
            <strong className="block">설명:</strong>
            <p className="whitespace-pre-line text-gray-600">{localDetail.description}</p>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="캠핑장 이미지" className="w-full rounded-lg" />
            </div>
          )}

          <p><strong>입실 시간:</strong> {localDetail.checkIn}</p>
          <p><strong>퇴실 시간:</strong> {localDetail.checkOut}</p>
          <p><strong>위치 좌표:</strong> {localDetail.latitude}, {localDetail.longitude}</p>
          <p><strong>지도 서비스:</strong> {localDetail.mapService}</p>
          <p><strong>등록일:</strong> {formatDate(localDetail.createdAt)}</p>
          <p><strong>수정일:</strong> {formatDate(localDetail.updatedAt)}</p>

          {localDetail.status === 0 && (
            <button
              onClick={handleDeactivate}
              className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
            >
              비활성화 처리
            </button>
          )}

          {localDetail.status === 2 && (
            <button
              onClick={handleActivate}
              className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
            >
              활성화 처리
            </button>
          )}

          {localDetail.status !== 0 && localDetail.status !== 2 && (
            <p className="text-gray-400 mt-4">처리 가능한 상태가 아닙니다.</p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCampgroundModal;
