import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";
import { getKSTDateTime } from "../../../utils/KST";

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
    await axios.patch(`/web/admin/campgrounds/${localDetail.id}/disable`, { disable: true }); // ✅경로, body 모두 일치!
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
    await axios.patch(`/web/admin/campgrounds/${localDetail.id}/disable`, { disable: false }); // ✅같은 경로, false로!
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
    return isNaN(date.getTime()) ? "-" : getKSTDateTime(date).split("T")[0];
  };

  if (!isOpen || !localDetail) return null;

  const environmentTags = localDetail.environments?.split(',').map((env, idx) => (
    <span key={idx} className="inline-block bg-purple-200 text-purple-800 text-xs px-2 py-1 rounded-full mr-1 mb-1">
      {env.replaceAll('_', ' ')}
    </span>
  ));

  let imageUrl = null;

  try {
    if (localDetail?.campgroundImage) {
    const parsed = JSON.parse(localDetail.campgroundImage);
    imageUrl = (parsed.map && parsed.map[0]) || (parsed.detail && parsed.detail[0]) || null;
    }
  } catch (e) {
    console.error("캠핑장 이미지 파싱 에러:", e);
  }

  const rawDescription = localDetail?.description || "";

  const description = rawDescription
  .replace(/\\r\\n/g, '\n')
  .replace(/\r\n/g, '\n');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-10 rounded-2xl w-[750px] max-w-[90vh] h-[850px] max-h-[90vh] shadow-2xl absolute flex flex-col overflow-y-auto"
        style={{ left: `${position.x}px`, top: `${position.y}px`, cursor: "default" }}
      >
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-purple-900/70 text-2xl">캠핑장 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="space-y-4 mt-6 text-black/80 text-lg leading-relaxed">
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
            <p className="whitespace-pre-line text-gray-500 text-base leading-relaxed">{description}</p>
          </div>

          {imageUrl && (
            <div className="mt-4">
              <img src={imageUrl} alt="캠핑장 이미지" className="w-full rounded-lg" />
            </div>
          )}
          <p><strong>위치 좌표:</strong> {localDetail.latitude}, {localDetail.longitude}</p>
          <p><strong>지도 서비스:</strong> {localDetail.mapService}</p>
          <p><strong>등록일:</strong> {formatDate(localDetail.createdAt)}</p>
          <p><strong>수정일:</strong> {formatDate(localDetail.updatedAt)}</p>

        <div className="flex justify-end gap-4 mt-4">
          {localDetail.status === 0 && (
            <button
              onClick={handleDeactivate}
              className="w-[150px] cursor-pointer text-white py-2 rounded-lg shadow-md bg-red-500 hover:bg-red-600 transition"
            >
              비활성화 처리
            </button>
          )}

          {localDetail.status === 2 && (
            <button
              onClick={handleActivate}
              className="w-[150px] cursor-pointer text-white py-2 rounded-lg shadow-md bg-green-600 hover:bg-green-700 transition"
            >
              활성화 처리
            </button>
          )}

          {localDetail.status !== 0 && localDetail.status !== 2 && (
            <p className="flex justify-end gap-4 mt-4 text-gray-400">
            처리 가능한 상태가 아닙니다.
            </p>
          )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminCampgroundModal;
