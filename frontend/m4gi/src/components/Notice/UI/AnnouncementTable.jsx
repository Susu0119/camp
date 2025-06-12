import TableHeader from "./TableHeader";
import TableRow from "./TableRow";

const AnnouncementTable = ({ notices, isAdmin, onEdit, onDelete }) => {
  return (
    <div className="w-full">
      <table className="w-full text-left border-separate border-spacing-y-2">
        <TableHeader isAdmin={isAdmin} />
        <tbody>
          {notices.length > 0 ? (
            notices.map((notice, index) => (
              <TableRow
                key={notice.noticeId}
                notice={notice}
                index={index + 1}
                isAdmin={isAdmin}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))
          ) : (
            <tr>
              <td colSpan={isAdmin ? 4 : 3} className="text-center py-5 text-gray-500">
                등록된 공지사항이 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default AnnouncementTable;
