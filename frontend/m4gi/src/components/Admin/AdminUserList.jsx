import { useEffect, useState } from "react";
import axios from "axios";

function AdminUserList() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    console.log("📦 useEffect 실행됨");
    axios.get("/web/admin/users")
      .then((response) => {
        console.log("✅ 서버 응답:", response.data);
        setUsers(response.data);
      })
      .catch((error) => {
        console.error("❌ 사용자 목록 불러오기 실패:", error);
      });
  }, []);

  const formatDate = (dateArray) => {
    if (!Array.isArray(dateArray)) return "날짜 없음";
    const [yyyy, mm, dd, hh = 0, mi = 0, ss = 0] = dateArray;
    return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")} ${String(hh).padStart(2, "0")}:${String(mi).padStart(2, "0")}:${String(ss).padStart(2, "0")}`;
  };

  return (
    <div className="p-4">
      <h1 className="text-xl font-bold mb-4">사용자 목록</h1>
      <table className="w-full border border-gray-300">
        <thead>
          <tr className="bg-gray-100">
            <th className="border px-4 py-2">닉네임</th>
            <th className="border px-4 py-2">이메일</th>
            <th className="border px-4 py-2">전화번호</th>
            <th className="border px-4 py-2">가입일</th>
          </tr>
        </thead>
        <tbody>
          {users.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center text-gray-500 py-4">사용자 정보가 없습니다.</td>
            </tr>
          ) : (
            users.map((user, idx) => (
              <tr key={idx}>
                <td className="border px-4 py-2">{user.nickname}</td>
                <td className="border px-4 py-2">{user.email}</td>
                <td className="border px-4 py-2">{user.phone}</td>
                <td className="border px-4 py-2">{formatDate(user.joinDate)}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default AdminUserList;
