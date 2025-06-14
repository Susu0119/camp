import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";
import { getKSTDateTime } from "../../../utils/KST";

// 상세 정보 항목 렌더링을 위한 헬퍼 컴포넌트
const DetailItem = ({ label, value, fullWidth = false }) => (
    <div className={fullWidth ? "col-span-2" : ""}>
        <dt className="text-sm font-medium text-gray-500">{label}</dt>
        <dd className="mt-1 text-base font-semibold text-gray-900 break-words">{value || "-"}</dd>
    </div>
);

function AdminCampgroundModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) {
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

  const startDrag = (e) => {
    if (e.target.closest('button')) return;
    setDragging(true);
    const rect = modalRef.current.getBoundingClientRect();
    offset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const onDrag = (e) => {
    if (!dragging) return;
    e.preventDefault();
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const stopDrag = () => setDragging(false);

  const handleDeactivate = async () => {
    const result = await adminConfirm("비활성화 처리", "정말 비활성화 처리하시겠습니까?", "네, 비활성화");
    if (!result.isConfirmed) return;
    try {
      await axios.patch(`/web/admin/campgrounds/${localDetail.id}/disable`, { disable: true });
      await adminSuccess("캠핑장이 비활성화 처리되었습니다.", "완료!");
      if (refreshList) refreshList();
      onClose();
    } catch (err) {
      console.error("❌ 비활성화 실패:", err);
      await adminError("비활성화 처리에 실패했습니다.", "오류");
    }
  };

  const handleActivate = async () => {
    const result = await adminConfirm("활성화 처리", "정말 이 캠핑장을 활성화할까요?", "네, 활성화");
    if (!result.isConfirmed) return;
    try {
      await axios.patch(`/web/admin/campgrounds/${localDetail.id}/disable`, { disable: false });
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
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const formatDate = (raw) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : getKSTDateTime(date).split("T")[0];
  };

  if (!isOpen || !localDetail) return null;

  const getStatusLabelText = (s) => {
    switch (Number(s)) {
      case 0: return "운영중";
      case 1: return "휴무중";
      case 2: return "비활성화";
      default: return "알 수 없음";
    }
  };

  const environmentTags = localDetail.environments?.split(',').map((env, idx) => (
    <span key={idx} className="inline-block bg-purple-100 text-purple-800 text-sm font-medium px-3 py-1 rounded-full mr-2 mb-2">
      # {env.replaceAll('_', ' ')}
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

  const description = (localDetail?.description || "").replace(/\\r\\n/g, '\n').replace(/\r\n/g, '\n');

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
      style={{ pointerEvents: "auto" }}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="absolute bg-white rounded-xl w-[750px] max-w-[90%] shadow-xl flex flex-col cursor-grab active:cursor-grabbing"
        style={{
          maxHeight: "90vh",
          left: `${position.x}px`,
          top: `${position.y}px`,
          transform: 'none'
        }}
      >
        {/* --- 헤더 (드래그 영역) --- */}
        <div 
          onMouseDown={startDrag}
          className="flex justify-between items-center p-6 border-b border-gray-200"
        >
          <h2 className="text-xl font-bold text-cpurple">캠핑장 상세 정보</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            style={{cursor: 'pointer'}}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- 콘텐츠 --- */}
        <div className="flex-1 p-6 overflow-y-auto">
          <div className="space-y-6">
            {/* [수정] 누락되었던 정보 필드를 다시 추가 */}
            <dl className="grid grid-cols-2 gap-x-6 gap-y-4">
              <DetailItem label="캠핑장 이름" value={localDetail.name} />
              <DetailItem label="연락처" value={localDetail.phone} />
              <DetailItem label="주소" value={localDetail.addrFull} fullWidth={true} />
              <DetailItem label="유형" value={localDetail.type} />
              <DetailItem label="상태" value={getStatusLabelText(localDetail.status)} />
              <DetailItem label="위치 좌표" value={`${localDetail.latitude || '-'}, ${localDetail.longitude || '-'}`} />
              <DetailItem label="지도 서비스" value={localDetail.mapService} />
              <DetailItem label="최초 등록일" value={formatDate(localDetail.createdAt)} />
              <DetailItem label="최근 수정일" value={formatDate(localDetail.updatedAt)} />
            </dl>

            <div>
              <h3 className="text-sm font-medium text-gray-500">운영 환경</h3>
              <div className="pt-2 flex flex-wrap">{environmentTags || "-"}</div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-500">설명</h3>
              <p className="mt-1 whitespace-pre-wrap text-base text-gray-800">{description || "-"}</p>
            </div>

            {imageUrl && (
              <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">대표 이미지</h3>
                  <img src={imageUrl} alt="캠핑장 대표 이미지" className="w-full h-auto max-h-80 object-cover rounded-lg border border-gray-200" />
              </div>
            )}
          </div>
        </div>

        {/* --- 푸터 (버튼 영역) --- */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          {localDetail.status === 0 && (
            <button
              onClick={handleDeactivate}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-sm hover:bg-red-700 transition-colors"
              style={{cursor: 'pointer'}}
            >
              비활성화 처리
            </button>
          )}
          {localDetail.status === 2 && (
            <button
              onClick={handleActivate}
              className="px-5 py-2 bg-green-600 text-white font-semibold rounded-lg shadow-sm hover:bg-green-700 transition-colors"
              style={{cursor: 'pointer'}}
            >
              활성화 처리
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminCampgroundModal;