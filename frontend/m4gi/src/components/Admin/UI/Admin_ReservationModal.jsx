import { useRef, useState, useEffect } from "react";
import { adminConfirm, adminSuccess, adminError } from "./Admin_Alert";
import axios from "axios";

// [신규] 가독성을 위해 상세 정보 항목을 렌더링하는 컴포넌트 분리
const DetailItem = ({ label, value, className = '' }) => (
  <div className={`py-3 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base font-semibold text-gray-900 break-words">{value || "-"}</dd>
  </div>
);

function AdminReservationModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const maskPhone = (phone) => phone?.replace(/(\d{3})-?\d{3,4}-?(\d{4})/, "$1-****-$2");

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

  useEffect(() => {
    if (localDetail) {
      console.log("환불 상태 코드:", localDetail.refundStatus, typeof localDetail.refundStatus);
    }
  }, [localDetail]);

  useEffect(() => {
    if (localDetail) {
      console.log("현재 모달에 띄운 예약 ID:", localDetail.reservationId);
      console.log("환불 상태 코드:", localDetail.refundStatus, typeof localDetail.refundStatus);
    }
  }, [localDetail]);

  const startDrag = (e) => {
    // 버튼 등 특정 요소에서는 드래그 방지
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

  if (!isOpen || !localDetail) return null;

  const formatDate = (raw) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  };

  const mapReservationStatus = (code) => {
    switch (code) {
      case 1: return "예약완료";
      case 2: return "예약취소";
      default: return "-";
    }
  };

  const mapRefundStatus = (code) => {
    switch (code) {
      case 1: return "환불대기";
      case 2: return "환불완료";
      case 3: return "환불거부";
      case 4: return "환불불가";
      default: return "-";
    }
  };

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  const handleRefundAction = async (action) => {
    const isApprove = action === "APPROVE";
    const confirmMsg = isApprove
      ? "정말 이 예약을 환불 승인 처리하시겠습니까?"
      : "정말 이 예약을 환불 거절 처리하시겠습니까?";
    const confirmBtn = isApprove ? "네, 승인" : "네, 거절";

    const result = await adminConfirm("환불 처리", confirmMsg, confirmBtn, "취소");
    if (!result.isConfirmed) return;

    try {
      await axios.post(`/web/admin/reservations/${localDetail.reservationId}/refund`, { action });
      const res = await axios.get(`/web/admin/reservations/${localDetail.reservationId}`);
      setLocalDetail(res.data);
      if (refreshList) refreshList();
      await adminSuccess("처리가 완료되었습니다.", "완료!");
    } catch (err) {
      console.error("요청이 실패하였습니다.", err);
      await adminError("요청이 실패하였습니다.", "오류");
    }
  };

  return (
    // [스타일 수정] 뒷 배경 추가 (어둡게 + 블러)
    <div
      className="fixed inset-0 z-50 flex items-center justify-center select-none bg-gray-900/50"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      {/* [스타일 수정] 카드 디자인 적용 및 패딩, 그림자 등 수정 */}
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
          <h2 className="text-xl font-bold text-cpurple">예약 상세 정보</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 transition-colors"
            style={{cursor: 'pointer'}}
          >
            {/* SVG 아이콘으로 변경 */}
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- 콘텐츠 --- */}
        <div className="flex-1 p-6 overflow-y-auto">
          {/* [스타일 수정] dl, dt, dd 태그를 사용한 그리드 레이아웃으로 변경 */}
          <dl className="grid grid-cols-2 gap-x-8
                   [&>div]:py-4
                   [&>div]:border-b 
                   [&>div]:border-gray-200
                   [&>div:nth-last-child(-n+2)]:border-b-0">
            <DetailItem label="예약자" value={localDetail.userNickname} />
            <DetailItem label="예약 ID" value={localDetail.reservationId} />
            <DetailItem label="전화번호" value={maskPhone(localDetail.phone)} />
            <DetailItem label="캠핑장" value={localDetail.campgroundName} />
            <DetailItem label="사이트" value={localDetail.reservationSite} />
            <DetailItem label="예약일" value={formatDate(localDetail.reservationDate)} />
            <DetailItem label="입실일" value={formatDate(localDetail.checkinTime)} />
            <DetailItem label="퇴실일" value={formatDate(localDetail.checkoutTime)} />
            <DetailItem label="예약상태" value={mapReservationStatus(localDetail.reservationStatus)} />
            <DetailItem label="환불상태" value={mapRefundStatus(localDetail.refundStatus)} />
            <DetailItem label="입실상태" value={localDetail.checkinStatus} />
            <DetailItem label="취소사유" value={localDetail.cancelReason} />
            {localDetail.cancelReason && localDetail.customReason && (
               <DetailItem label="상세 사유" value={localDetail.customReason} className="col-span-2" />
<<<<<<< HEAD
           )}
=======
            )}
>>>>>>> dev
          </dl>
        </div>

        {/* --- 푸터 (버튼 영역) --- */}
        {localDetail.refundStatus === 1 && (
          <div className="flex justify-end gap-3 p-4 bg-gray-50 border-t border-gray-200 rounded-b-xl">
            {/* [스타일 수정] 버튼 스타일 통일 */}
            <button
              onClick={() => handleRefundAction("APPROVE")}
              className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors"
              style={{cursor: 'pointer'}}
            >
              환불 승인
            </button>
            <button
              onClick={() => handleRefundAction("REJECT")}
              className="px-5 py-2 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
              style={{cursor: 'pointer'}}
            >
              환불 거절
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default AdminReservationModal;