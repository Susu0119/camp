import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminUserModal from "./Admin_UserModal";
import Pagination from './Admin_Pagination';

const getUserRoleLabel = (roleCode) => {
  switch (roleCode) {
    case 1: return <span className="text-blue-500">일반 사용자</span>;
    case 2: return <span className="text-green-500">캠핑장 관계자</span>;
    case 3: return <span className="text-purple-500">관리자</span>;
    default: return <span className="text-gray-400">알 수 없음</span>;
  }
};

const getUserStatusLabel = (status) => {
  switch (status) {
    case 0: return <span className="text-yellow-400">활성</span>;
    case 1: return <span className="text-gray-400">비활성</span>;
    default: return <span className="text-red-400">알 수 없음</span>;
  }
};

const formatDate = (dateArray) => {
  if (!Array.isArray(dateArray)) return "날짜 없음";
  const [yyyy, mm, dd] = dateArray;
  return `${yyyy}-${String(mm).padStart(2, "0")}-${String(dd).padStart(2, "0")}`;
};

export default function AdminUserList() {
  const itemsPerPage = 14;
  const [users, setUsers] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [keyword, setKeyword] = useState("");
  const [userRole, setUserRole] = useState("");
  const [userStatus, setUserStatus] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  const fetchUsers = async (params = {}) => {
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(params).filter(([, v]) => v !== "")
      );
      const res = await axios.get("/web/admin/users/search", { params: filteredParams });
      const data = Array.isArray(res.data) ? res.data : res.data.users || [];
      setUsers(data);
      setFiltered(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 사용자 목록 불러오기 실패:", err);
      alert("데이터를 불러오는 데 실패했습니다.");
      setFiltered([]);
    }
  };

  useEffect(() => {
    fetchUsers({ sortOrder: "DESC" });
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers({ keyword, userRole, userStatus, startDate, endDate, sortOrder });
  };

  const resetFilters = () => {
    setKeyword("");
    setUserRole("");
    setUserStatus("");
    setStartDate("");
    setEndDate("");
    setSortOrder("DESC");
    fetchUsers({ sortOrder: "DESC" });
  };

  const handleRowClick = async (providerCode, providerUserId) => {
    try {
      const res = await axios.get("/web/admin/users/detail", { params: { providerCode, providerUserId } });
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("❌ 사용자 상세 조회 실패:", err);
    }
  };

  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <div className="min-h-screen bg-gray-10 flex select-none">
      <Sidebar />
      <main className="flex-1 px-8 py-6 max-w-screen-2xl mx-auto">
        <h1 className="text-4xl text-purple-900/70 mt-4 mb-6">사용자 목록</h1>
        <form onSubmit={handleSearch} className="mb-6 p-4 text-black/70 border border-gray-200 shadow-sm rounded-xl flex flex-col gap-4">
          <div className="flex flex-wrap justify-end gap-4">
            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />
            <span className="self-center text-sm text-gray-400">~</span>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none" />
            <select value={sortOrder} 
            onChange={(e) => {
              const value = e.target.value;
              setSortOrder(value);
              console.log("🔄 정렬 드롭다운 선택:", value);
              fetchUsers({
                keyword,
                userRole,
                userStatus,
                startDate,
                endDate,
                sortOrder: value });
            }} 
            className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="DESC">최신순</option>
              <option value="ASC">오래된순</option>
            </select>
            <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="">전체 상태</option>
              <option value="0">활성</option>
              <option value="1">비활성</option>
            </select>
            <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="px-4 py-2 border border-gray-200 rounded-xl focus:outline-none">
              <option value="">전체 권한</option>
              <option value="1">일반 사용자</option>
              <option value="2">캠핑장 관계자</option>
              <option value="3">관리자</option>
            </select>
          </div>
          <div className="flex justify-end gap-4">
            <input type="text" name="keyword" placeholder="닉네임 or 이메일 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="bg-purple-300/30 px-4 py-1 rounded-xl w-60 focus:outline-none shadow-sm" />
            <button type="submit" className="bg-purple-900/80 hover:bg-purple-900/90 text-white px-6 py-2 rounded-lg shadow-sm cursor-pointer">검색</button>
            <button type="button" onClick={resetFilters} className="bg-gray-400/50 hover:bg-gray-400/80 text-black/70 px-4 py-2 rounded-lg shadow-sm cursor-pointer">초기화</button>
          </div>
        </form>
        <div className="overflow-hidden rounded-xl shadow-sm border border-gray-200">
          <table className="w-full border-collapse text-lg text-black/80">
            <thead className="bg-gray-100">
              <tr>
                <th className="border-b border-gray-200 px-6 py-3 text-center">닉네임</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">이메일</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">권한</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">가입일</th>
                <th className="border-b border-gray-200 px-6 py-3 text-center">상태</th>
              </tr>
            </thead>
            <tbody>
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-gray-400 py-4">사용자 정보가 없습니다.</td></tr>
              ) : (
                paginatedUsers.map((user, i) => (
                  <tr key={i} onClick={() => handleRowClick(user.providerCode, user.providerUserId)} className="hover:bg-purple-100 transition cursor-pointer">
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{user.nickname}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center text-sm">{user.email}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{getUserRoleLabel(user.userRole)}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{formatDate(user.joinDate)}</td>
                    <td className="border-b border-gray-300 px-8 py-4 whitespace-nowrap text-center">{getUserStatusLabel(user.userStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onChange={setCurrentPage} // setCurrentPage 그대로 넘기면 됨!
        pageRange={2} // 옵션, 기본값 2
        />

        {modalOpen && (
          <AdminUserModal
            key={selectedDetail?.providerUserId}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedDetail(null);
            }}
            detail={selectedDetail}
            refreshList={() => fetchUsers({ keyword, userRole, userStatus, startDate, endDate, sortOrder })}
          />
        )}
      </main>
    </div>
  );
}
