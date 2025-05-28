import { useRef, useState, useEffect } from "react";
import axios from "axios";
import Swal from 'sweetalert2';

function AdminUserModal({ isOpen, onClose, detail, refreshList }) {
  const modalRef = useRef(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(false);
  const offset = useRef({ x: 0, y: 0 });
  const [localDetail, setLocalDetail] = useState(detail);

  // detail을 로컬 상태로 저장 + userStatus는 숫자로 강제 변환
  useEffect(() => {
    if (isOpen && detail) {
      setLocalDetail({
        ...detail,
        userStatus: Number(detail.userStatus),
      });
    }
  }, [isOpen, detail]);

  // 모달 초기 위치 가운데로 설정
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

  const handleChangeRole = async (newRole) => {
  const result = await Swal.fire({
    title: '권한 변경',
    text: '정말 권한을 변경하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '네, 변경할게요',
    cancelButtonText: '취소',
  });

  if (!result.isConfirmed) return;

  try {
    await axios.patch("/web/admin/users/role", {
      providerCode: localDetail.providerCode,
      providerUserId: localDetail.providerUserId,
      role: newRole,
    });

    await Swal.fire('완료!', '✅ 권한이 변경되었습니다.', 'success');
    refreshList?.();
    onClose();
  } catch (err) {
    console.error("❌ 권한 변경 실패:", err);
    Swal.fire('오류', '❌ 권한 변경에 실패했습니다.', 'error');
  }
};

  const handleWithdraw = async () => {
  const result = await Swal.fire({
    title: '탈퇴 처리',
    text: '정말 탈퇴(비활성화) 처리하시겠습니까?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: '네, 탈퇴 처리',
    cancelButtonText: '취소',
  });

  if (!result.isConfirmed) return;

  try {
    await axios.patch("/web/admin/users/withdraw", {
      providerCode: localDetail.providerCode,
      providerUserId: localDetail.providerUserId,
    });

    await Swal.fire('완료!', '✅ 회원이 탈퇴 처리되었습니다.', 'success');
    refreshList?.();
    onClose();
  } catch (err) {
    console.error("❌ 탈퇴 실패:", err);
    Swal.fire('오류', '❌ 탈퇴 처리에 실패했습니다.', 'error');
  }
};

useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, onClose]);

const handleActivate = async () => {
  try {
    await axios.patch("/web/admin/users/activate", {
      providerCode: localDetail.providerCode,
      providerUserId: localDetail.providerUserId,
    });

    await Swal.fire('완료!', '✅ 사용자가 다시 활성화되었습니다.', 'success');
    refreshList?.();
    onClose();
  } catch (err) {
    console.error("❌ 활성화 실패:", err);
    Swal.fire('오류', '❌ 활성화 처리에 실패했습니다.', 'error');
  }
};

  if (!isOpen || !localDetail) return null;

  const formatDate = (raw) => {
    if (!raw) return "-";
    const date = new Date(raw);
    return isNaN(date.getTime()) ? "-" : date.toISOString().split("T")[0];
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onMouseMove={dragging ? onDrag : null}
      onMouseUp={stopDrag}
      style={{ pointerEvents: "auto" }}
    >
      <div
        ref={modalRef}
        onMouseDown={startDrag}
        className="bg-white p-6 rounded-xl w-[420px] shadow-lg absolute"
        style={{ left: `${position.x}px`, top: `${position.y}px`, cursor: "default" }}
      >
        <div className="flex justify-between items-center mb-4 select-none">
          <h2 className="text-lg font-semibold">사용자 상세 정보</h2>
          <button onClick={onClose} className="text-xl font-bold">&times;</button>
        </div>

        <div className="space-y-2 text-sm">
          <p><strong>닉네임:</strong> {localDetail.nickname}</p>
          <p><strong>이메일:</strong> {localDetail.email}</p>
          <p><strong>전화번호:</strong> {localDetail.phone}</p>
          <p><strong>가입일:</strong> {formatDate(localDetail.joinDate)}</p>

          <div className="pt-3 space-y-2">
            <label className="block text-sm font-semibold">권한 변경</label>
            <select
              value={localDetail.userRole}
              onChange={(e) => handleChangeRole(Number(e.target.value))}
              className="w-full p-2 border border-gray-300 rounded-md"
            >
              <option value={1}>일반 사용자</option>
              <option value={2}>캠핑장 관계자</option>
              <option value={3}>관리자</option>
            </select>

            {localDetail.userStatus === 0 && (
              <button
                onClick={handleWithdraw}
                className="mt-4 w-full bg-red-500 text-white py-2 rounded-md hover:bg-red-600"
              >
                비활성화 처리
              </button>
            )}

            {localDetail.userStatus === 1 && (
              <button
                onClick={handleActivate}
                className="mt-2 w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-600"
              >
                활성화 처리
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminUserModal;
