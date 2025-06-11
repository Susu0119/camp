import { useRef, useState, useEffect } from "react";
import axios from "axios";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";

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

  const handleProcess = async (newStatus) => {
    const label = newStatus === 2 ? "처리 완료" : "반려 처리";
    // SweetAlert2 확인창
    const result = await adminConfirm(
      `${label} 처리`,
      `정말 "${label}"로 변경하시겠습니까?`,
      "네, 진행할게요",
      "취소"
    );
    if (!result.isConfirmed) return;
  
    try {
      await axios.patch(`/web/admin/reports/${localDetail.reportId}`, {
        status: newStatus,
      });
      await adminSuccess(`신고가 "${label}"로 변경되었습니다.`, "완료!");
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

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen || !localDetail) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-10 rounded-2xl w-[700px] max-w-[90%] h-[750px] max-h-[90%] shadow-2xl absolute flex flex-col overflow-y-auto"
        style={{ left: `${position.x}px`, top: `${position.y}px`, cursor: "default" }}
      >
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-purple-900/70 text-2xl">신고 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="flex flex-col mt-6 gap-x-6 gap-y-4 text-lg text-black/80 leading-relaxed">
          <p><strong>신고 ID:</strong> {localDetail.reportId}</p>
          <p className="break-all max-w-[700px]">
          <p><strong>리뷰 ID:</strong> {localDetail.reviewId}</p>
          </p>
          <p><strong>신고자:</strong> {localDetail.reporterId} ({localDetail.reporterNickname})</p>
          <p><strong>캠핑장:</strong> {localDetail.campgroundName}</p>
          <p><strong>신고 사유:</strong></p>
          <p className="whitespace-pre-line text-yellow-500">{localDetail.reportReason}</p>
          <p><strong>상태:</strong> {localDetail.reportStatus === 2 ? "처리 완료" : "처리 대기"}</p>
          <p><strong>신고 일시:</strong> {formatDateTime(localDetail.createdAt)}</p>
          <p><strong>처리 일시:</strong> {formatDateTime(localDetail.processedAt)}</p>

          {localDetail.reviewContent && (
          <>
          <p><strong>리뷰 본문:</strong></p>
          <p className="max-h-[200px] overflow-y-auto whitespace-pre-line  text-purple-800 bg-purple-100 border border-gray-200 p-4 rounded-md shadow-sm">
           {localDetail.reviewContent}
          </p>
          </>
          )}

      {localDetail.reportStatus === 1 && (
        <div className="flex justify-end gap-4 mt-auto">
        <button
            onClick={() => handleProcess(2)}
            className="w-[120px] px-3 py-2 bg-purple-900/80 hover:bg-purple-900/90 cursor-pointer shadow-md text-white rounded-lg"
        >
          처리 완료
        </button>
        <button
           onClick={() => handleProcess(3)}
           className="w-[120px] px-3 py-2 bg-gray-400/50 hover:bg-gray-400/80 text-black/70 rounded-lg cursor-pointer shadow-md"
        >
          반려 처리
        </button>
        </div>
      )}

     {[2, 3].includes(localDetail.reportStatus) && (
      <p className="flex justify-end gap-4 mt-auto text-gray-400">
       {localDetail.reportStatus === 2 ? "이미 처리 완료된 신고입니다." : "이미 반려 처리된 신고입니다."}
      </p>
      )}

        </div>
      </div>
    </div>
  );
}

export default AdminReportModal;