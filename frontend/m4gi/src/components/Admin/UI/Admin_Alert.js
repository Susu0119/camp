// 📁 src/utils/adminAlert.js
import Swal from "sweetalert2";

// ✅ 관리자 확인용 알림창
export const adminConfirm = async (
  title = "관리자 확인",
  text = "이 작업을 진행하시겠습니까?",
  confirmText = "네, 진행할게요",
  cancelText = "취소"
) => {
  return await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText: confirmText,
    cancelButtonText: cancelText,
     // 버튼 색상 커스텀
    confirmButtonColor: "#6d28d9",
    cancelButtonColor: "#a3a3a3",
  });
};

// ✅ 관리자 성공 메시지
export const adminSuccess = async (
  text = "작업이 완료되었습니다.",
  title = "완료!"
) => {
  return await Swal.fire({
    title,
    text,
    icon: "success",
    confirmButtonColor: "#6d28d9",
  });
};

// ✅ 관리자 에러 메시지
export const adminError = async (
  text = "처리 중 오류가 발생했습니다.",
  title = "오류"
) => {
  return await Swal.fire({
    title,
    text,
    icon: "error",
    confirmButtonColor: "#6d28d9",
  });
};