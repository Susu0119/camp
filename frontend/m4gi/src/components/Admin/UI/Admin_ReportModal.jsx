import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";

// 가독성을 위해 상세 정보 항목을 렌더링하는 컴포넌트
const DetailItem = ({ label, value, className = '', children }) => (
  <div className={`py-3 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base font-semibold text-gray-900 break-words">
      {value || children || "-"}
    </dd>
  </div>
);

function AdminReportModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) {
      setLocalDetail(detail);
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
    setPosition({
      x: e.clientX - offset.current.x,
      y: e.clientY - offset.current.y,
    });
  };

  const stopDrag = () => setDragging(false);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleProcess = async (newStatus) => {
    const isApprove = newStatus === 2;
    const label = isApprove ? "처리 완료" : "반려 처리";
    const confirmMsg = `정말 이 신고를 "${label}" 하시겠습니까?`;
    const confirmBtn = isApprove ? "네, 처리" : "네, 반려";

    const result = await adminConfirm(label, confirmMsg, confirmBtn, "취소");
    if (!result.isConfirmed) return;

    try {
      await axios.patch(`/web/admin/reports/${localDetail.reportId}`, {
        status: newStatus,
      });
      await adminSuccess(`신고가 성공적으로 "${label}" 되었습니다.`, "완료!");
      const res = await axios.get(`/web/admin/reports/${localDetail.reportId}`);
      setLocalDetail(res.data);
      if (refreshList) refreshList();
      onClose();
    } catch (err) {
      console.error("상태 변경 실패:", err);
      await adminError("상태 변경에 실패했습니다.", "오류");
    }
  };

  const formatDateTime = (arr) => {
    if (!arr || !Array.isArray(arr)) return "-";
    const [y, m, d, h = 0, min = 0] = arr;
    return `${y}-${String(m).padStart(2, "0")}-${String(d).padStart(2, "0")} ${String(h).padStart(2, "0")}:${String(min).padStart(2, "0")}`;
  };

  const mapReportStatus = (code) => {
    switch (code) {
      case 1: return "처리대기";
      case 2: return "처리완료";
      case 3: return "처리반려";
      default: return "-";
    }
  };

  if (!isOpen || !localDetail) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none cursor-grab active:cursor-grabbing bg-gray-900/50"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white rounded-xl w-[700px] max-w-[90%] shadow-xl absolute flex flex-col"
        style={{
          maxHeight: "90vh",
          left: `${position.x}px`,
          top: `${position.y}px`,
        }}
      >
        {/* --- 헤더 --- */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-cpurple">신고 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
            style={{ cursor: 'pointer' }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- 콘텐츠 (레이아웃 수정됨) --- */}
        <div className="flex-1 p-6 overflow-y-auto">
          <dl className="grid grid-cols-2 gap-x-8
                         [&>div]:py-4
                         [&>div]:border-b 
                         [&>div]:border-gray-200
                         [&>div:nth-last-child(-n+2)]:border-b-0">
            
            <DetailItem label="신고 ID" value={localDetail.reportId} />
            <DetailItem label="리뷰 ID" value={localDetail.reviewId} />
            
            <DetailItem label="신고자" value={`${localDetail.reporterNickname} (${localDetail.reporterId})`} />
            <DetailItem label="캠핑장" value={localDetail.campgroundName} />

            {/* 요청 사항: 신고일시와 처리일시를 나란히 배치 */}
            <DetailItem label="신고 일시" value={formatDateTime(localDetail.createdAt)} />
            <DetailItem label="처리 일시" value={formatDateTime(localDetail.processedAt)} />
            
            {/* 한 줄 전체를 사용하는 항목들 */}
            <DetailItem label="상태" value={mapReportStatus(localDetail.reportStatus)} className="col-span-2" />
            <DetailItem label="신고 사유" value={localDetail.reportReason} className="col-span-2" />
            
            {localDetail.reviewContent && (
              <DetailItem label="리뷰 원문" className="col-span-2">
                <p className="max-h-[200px] overflow-y-auto whitespace-pre-line text-sm text-purple-800 bg-purple-50 border border-gray-200 p-4 rounded-md shadow-sm font-normal">
                  {localDetail.reviewContent}
                </p>
              </DetailItem>
            )}
          </dl>
        </div>

        {/* --- 푸터 (버튼 영역) --- */}
        <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
          {localDetail.reportStatus === 1 ? (
            <>
              <button
                onClick={() => handleProcess(2)}
                className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                처리 완료
              </button>
              <button
                onClick={() => handleProcess(3)}
                className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                style={{ cursor: 'pointer' }}
              >
                반려 처리
              </button>
            </>
          ) : (
            <p className="text-gray-500 text-sm font-medium">
              {localDetail.reportStatus === 2 ? "이미 처리 완료된 신고입니다." : "이미 반려 처리된 신고입니다."}
            </p>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReportModal;