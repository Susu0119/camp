import { useNavigate } from 'react-router-dom';

export const TableRow = ({ notice, isAdmin, onEdit, onDelete }) => {
  const navigate = useNavigate();

  const formatDate = (dateArray) => {
    if (!dateArray || dateArray.length < 3) return "";
    const [yyyy, mm, dd] = dateArray;
    return `${yyyy}-${String(mm).padStart(2, '0')}-${String(dd).padStart(2, '0')}`;
  };

  return (
    <tr className="grid grid-cols-12 items-center px-6 py-4 border-b text-sm hover:bg-gray-50">
      {/* 번호 */}
      <td className="col-span-1 text-center text-zinc-900">{notice.noticeId}</td>

      {/* 제목 */}
      <td
        className="col-span-7 text-blue-600 hover:underline cursor-pointer text-left"
        onClick={() => navigate(`/notice/${notice.noticeId}`)}
      >
        {notice.noticeTitle}
      </td>

      {/* 작성일 */}
      <td className="col-span-2 text-center text-zinc-900">
        {formatDate(notice.createdAt)}
      </td>

      {/* 관리자일 경우 버튼, 아니면 빈 영역 */}
      <td className="col-span-2 flex justify-center gap-2">
        {isAdmin ? (
          <>
            <button
              onClick={() => onEdit(notice.noticeId)}
              className="px-3 py-1 text-xs font-medium bg-yellow-400 text-white rounded hover:bg-yellow-500 transition"
            >
              수정
            </button>
            <button
              onClick={() => onDelete(notice.noticeId)}
              className="px-3 py-1 text-xs font-medium bg-red-500 text-white rounded hover:bg-red-600 transition"
            >
              삭제
            </button>
          </>
        ) : null}
      </td>
    </tr>
  );
};

export default TableRow;
