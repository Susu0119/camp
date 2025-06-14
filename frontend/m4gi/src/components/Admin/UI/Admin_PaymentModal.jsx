import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';
import { getKSTDateTime } from "../../../utils/KST";

// [신규] 가독성을 위해 상세 정보 항목을 렌더링하는 컴포넌트 분리
const DetailItem = ({ label, value, className = '' }) => (
  <div className={`py-3 ${className}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-base font-semibold text-gray-900 break-words">{value || "-"}</dd>
  </div>
);

function AdminPaymentModal({ isOpen, onClose, detail }) {
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

  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

  // [수정] 드래그 시작 함수: 버튼 클릭 시에는 드래그가 시작되지 않도록 조건 추가
  const startDrag = (e) => {
    // e.target이 버튼이면 드래그를 시작하지 않음
    if (e.target.tagName === 'BUTTON') {
        return;
    }
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
    if (Array.isArray(raw)) {
      const [year, month, day, hour = 0, minute = 0] = raw;
      return `${year}-${String(month).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    }
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : getKSTDateTime(date).split("T")[0];
  };

  const isNullOrEmpty = (v) => v === null || v === undefined || v === "";

  const getPaymentStatusText = (s) => {
    switch (Number(s)) {
      case 2: return "결제완료";
      case 3: return "결제취소";
      default: return "-";
    }
  };

  const getPaymentMethodText = (method) => {
    switch (Number(method)) {
      case 1: return "카카오페이";
      case 2: return "무통장입금";
      default: return "-";
    }
  };

  const getApprovalStatusTextByRefund = (status) => {
    switch (Number(status)) {
      case 1: return "승인대기";
      case 2: return "승인됨";
      case 3: return "승인거부";
      case 4: return "승인불가";
      default: return "-";
    }
  };

  return (
    // [수정] 배경 div에 onMouseMove와 onMouseUp을 두어 모달 밖으로 마우스가 나가도 드래그가 끊기지 않게 함
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/60"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
    >
      {/* 카드 디자인 및 스타일 적용 */}
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
        {/* [수정] 헤더에 onMouseDown과 cursor 스타일을 적용하여 드래그 핸들로 사용 */}
        <div
          onMouseDown={startDrag}
          className="flex justify-between items-center p-6 border-b border-gray-200"
        >
          <h2 className="text-xl font-bold text-cpurple">결제 상세 정보</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* --- 콘텐츠 --- */}
        {/* [수정] 콘텐츠 영역은 더 이상 드래그 로직에 영향을 받지 않아 텍스트 선택이 가능 */}
        <div className="flex-1 p-6 overflow-y-auto">
          <dl className="grid grid-cols-2 gap-x-8
                         [&>div]:py-4
                         [&>div]:border-b
                         [&>div]:border-gray-200
                         [&>div:nth-last-child(-n+2)]:border-b-0">
            <DetailItem label="예약자" value={localDetail.userNickname} />
            <DetailItem label="전화번호" value={localDetail.userPhone} />
            <DetailItem label="캠핑장" value={localDetail.campgroundName} />
            <DetailItem label="사이트" value={localDetail.reservationSite} />
            <DetailItem label="입실일" value={formatDate(localDetail.checkinTime)} />
            <DetailItem label="퇴실일" value={formatDate(localDetail.checkoutTime)} />
            <DetailItem label="결제금액" value={`${localDetail.paymentPrice?.toLocaleString()}원`} />
            <DetailItem label="결제수단" value={getPaymentMethodText(localDetail.paymentMethod)} />
            <DetailItem label="결제상태" value={getPaymentStatusText(localDetail.paymentStatus)} />
            <DetailItem label="결제일자" value={formatDate(localDetail.paidAt)} />
            <DetailItem label="승인상태" value={getApprovalStatusTextByRefund(localDetail.refundStatus)} />
            <DetailItem label="환불일자" value={localDetail.refundedAt ? formatDate(localDetail.refundedAt) : '-'} />
            
            {localDetail.refundAmount != null && (
              <DetailItem label="환불금액" value={`${localDetail.refundAmount?.toLocaleString()}원`} />
            )}
            {localDetail.feeAmount != null && (
              <DetailItem label="수수료" value={`${localDetail.feeAmount?.toLocaleString()}원`} />
            )}
            {localDetail.refundType != null && (
              <DetailItem label="환불유형" value={
                (!localDetail.refundStatus || Number(localDetail.refundStatus) === 1 || isNullOrEmpty(localDetail.refundType))
                ? "-"
                : (Number(localDetail.refundType) === 1 ? "수동" : "자동")
              } />
            )}
          </dl>
        </div>
      </div>
    </div>
  );
}

export default AdminPaymentModal;