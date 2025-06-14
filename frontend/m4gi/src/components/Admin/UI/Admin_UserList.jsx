import { useEffect, useState } from "react";
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminUserModal from "./Admin_UserModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

// --- 상태 라벨 컴포넌트 (가독성을 위해 font-semibold 추가) ---
const getUserRoleLabel = (roleCode) => {
  switch (roleCode) {
    case 1: return <span className="text-blue-600 font-semibold">일반</span>;
    case 2: return <span className="text-green-600 font-semibold">관계자</span>;
    case 3: return <span className="text-purple-600 font-semibold">관리자</span>;
    default: return <span className="text-gray-500">알 수 없음</span>;
  }
};

const getUserStatusLabel = (status) => {
  switch (status) {
    case 0: return <span className="text-green-600 font-semibold">활성</span>;
    case 1: return <span className="text-gray-500 font-semibold">비활성</span>;
    default: return <span className="text-red-500">알 수 없음</span>;
  }
};

const formatDate = (dateArray) => {
  if (!Array.isArray(dateArray) || dateArray.length < 3) return "-";
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
        Object.entries(params).filter(([, v]) => v !== "" && v !== null)
      );
      const res = await axios.get("/web/admin/users/search", { params: filteredParams });
      const data = Array.isArray(res.data) ? res.data : (res.data.users || []);
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

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    setSortOrder(newSortOrder);
    fetchUsers({ keyword, userRole, userStatus, startDate, endDate, sortOrder: newSortOrder });
  };

  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <div className="bg-slate-50 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">사용자 관리</h1>
          <p className="text-gray-500 mt-1">회원 정보를 검색하고 관리합니다.</p>
        </header>

        {/* [수정] 필터 및 검색 카드 */}
        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={handleSearch}>
            <div className="space-y-5">
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                {/* 가입일 조회 그룹 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">가입일 조회</label>
                  <div className="flex items-center gap-2">
                    <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <span className="text-gray-500">~</span>
                    <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                {/* 사용자 속성 그룹 */}
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">사용자 속성</label>
                  <div className="flex items-center flex-wrap gap-2">
                    <select value={userRole} onChange={(e) => setUserRole(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">전체 권한</option>
                      <option value="1">일반</option>
                      <option value="2">관계자</option>
                      <option value="3">관리자</option>
                    </select>
                    <select value={userStatus} onChange={(e) => setUserStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">전체 상태</option>
                      <option value="0">활성</option>
                      <option value="1">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
              {/* 검색 및 액션 그룹 */}
              <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                      <SearchIcon />
                    </span>
                    <input type="text" placeholder="닉네임 or 이메일" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <select value={sortOrder} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="DESC">최신순</option>
                    <option value="ASC">오래된순</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors">검색</button>
                  <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors">초기화</button>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* [수정] 테이블 카드 */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-center font-medium">닉네임</th>
                <th className="px-6 py-3 text-center font-medium">이메일</th>
                <th className="px-6 py-3 text-center font-medium">권한</th>
                <th className="px-6 py-3 text-center font-medium">가입일</th>
                <th className="px-6 py-3 text-center font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {paginatedUsers.length === 0 ? (
                <tr><td colSpan="5" className="text-center text-gray-500 py-16">사용자 정보가 없습니다.</td></tr>
              ) : (
                paginatedUsers.map((user) => (
                  <tr key={`${user.providerCode}-${user.providerUserId}`} onClick={() => handleRowClick(user.providerCode, user.providerUserId)} className="text-center hover:bg-purple-50 transition cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap">{user.nickname}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{user.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getUserRoleLabel(user.userRole)}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-gray-600">{formatDate(user.joinDate)}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{getUserStatusLabel(user.userStatus)}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
          {totalPages > 1 && (
            <div className="p-4 border-t border-gray-200">
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onChange={setCurrentPage}
                pageRange={2}
              />
            </div>
          )}
        </div>

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