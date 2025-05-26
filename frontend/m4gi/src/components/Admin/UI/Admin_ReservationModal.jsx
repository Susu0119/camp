import { useRef, useState, useEffect } from "react";
import axios from "axios";

function AdminReservationModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });

  // detail을 로컬 상태로 복사해서 씀
  const [localDetail, setLocalDetail] = useState(detail);

  useEffect(() => {
    if (isOpen && detail) {
      setLocalDetail(detail); // 모달 열릴 때 최신값 세팅
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
      case 0: return "예약완료";
      case 1: return "입실완료";
      case 2: return "취소됨";
      default: return "알 수 없음";
    }
  };

  const mapRefundStatus = (code) => {
  switch (code) {
    case 1: return "환불대기";
    case 2: return "환불완료";
    case 3: return "환불거부";
    default: return "-";
  }
};

  const handleRefundAction = async (action) => {
    try {
      await axios.post(`/web/admin/reservations/${localDetail.reservationId}/refund`, { action });

      const res = await axios.get(`/web/admin/reservations/${localDetail.reservationId}`);
      setLocalDetail(res.data); // 최신 데이터로 갱신

      if (refreshList) refreshList();
      alert("처리가 완료되었습니다.");
    } catch (err) {
      console.error("요청이 실패하였습니다.", err);
      alert("요청이 실패하였습니다.");
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null} // 드래그 중일때만 이벤트 등록록
      onMouseUp={stopDrag}
      style={{ pointerEvents: "auto", overflowY: "auto" }}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-6 rounded-xl w-[400px] shadow-lg absolute"
        style={{
          maxHeight: "90vh",
          left: `${position.x}px`,
          top: `${position.y}px`,
          cursor: "default",
        }}
      >
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-lg font-semibold">예약 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>예약자명:</strong> {localDetail.userNickname}</p>
          <p><strong>캠핑장:</strong> {localDetail.campgroundName}</p>
          <p><strong>사이트:</strong> {localDetail.reservationSite}</p>
          <p><strong>입실일:</strong> {formatDate(localDetail.checkinTime)}</p>
          <p><strong>퇴실일:</strong> {formatDate(localDetail.checkoutTime)}</p>
          <p><strong>예약상태:</strong> {mapReservationStatus(localDetail.reservationStatus)}</p>
          <p><strong>환불상태:</strong> {mapRefundStatus(localDetail.refundStatus)}</p>
          <p><strong>입실상태:</strong> {localDetail.checkinStatus}</p>
          <p><strong>취소사유:</strong> {localDetail.cancelReason}</p>

          {localDetail.refundStatus === 1 && (
            <div className="pt-3 space-x-2">
              <button
                onClick={() => handleRefundAction("APPROVE")} // 백엔드 action에 맞게 수정정
                className="px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm"
              >
                환불 승인
              </button>
              <button
                onClick={() => handleRefundAction("REJECT")}
                className="px-3 py-1 bg-gray-500 text-white rounded-md hover:bg-gray-600 text-sm"
              >
                환불 거절
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminReservationModal;
