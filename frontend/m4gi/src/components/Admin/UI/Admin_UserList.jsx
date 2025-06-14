import { useEffect, useState, useCallback } from "react"; // useCallback 추가
import axios from "axios";
import Sidebar from "./Admin_Sidebar";
import AdminUserModal from "./Admin_UserModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

// --- 상태 라벨 컴포넌트 (변경 없음) ---
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

// 스켈레톤 UI 컴포넌트 (변경 없음)
const Skeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div></td>
  </tr>
);


export default function AdminUserList() {
  const itemsPerPage = 14;

  const [filtered, setFiltered] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);

  // 필터 조건들을 하나의 객체로 관리하여 코드 가독성 향상
  const [filters, setFilters] = useState({
    keyword: "",
    userRole: "",
    userStatus: "",
    startDate: "",
    endDate: "",
    sortOrder: "DESC",
  });

  // [개선] fetch 함수를 useCallback으로 감싸 불필요한 재성성 방지
  const fetchUsers = useCallback(async (currentFilters) => {
    setIsLoading(true);
    try {
      const filteredParams = Object.fromEntries(
        Object.entries(currentFilters).filter(([, v]) => v !== "" && v !== null)
      );
      const res = await axios.get("/web/admin/users/search", { params: filteredParams });
      const data = Array.isArray(res.data) ? res.data : (res.data.users || []);
      // [개선] filtered 상태에만 데이터 저장
      setFiltered(data);
      setCurrentPage(1);
    } catch (err) {
      console.error("❌ 사용자 목록 불러오기 실패:", err);
      alert("데이터를 불러오는 데 실패했습니다.");
      setFiltered([]);
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  }, []); // 의존성 배열이 비어있으므로, 함수는 최초 렌더링 시에만 생성

  useEffect(() => {
    fetchUsers(filters);
  }, [fetchUsers]); // fetchUsers가 변경될 때만 실행 (최초 1회)

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({...prev, [name]: value}));
  };
  
  const handleSearch = (e) => {
    e.preventDefault();
    fetchUsers(filters);
  };

  const resetFilters = () => {
    const initialFilters = {
        keyword: "", userRole: "", userStatus: "",
        startDate: "", endDate: "", sortOrder: "DESC",
    };
    setFilters(initialFilters);
    fetchUsers(initialFilters);
  };

  const handleRowClick = async (providerCode, providerUserId) => {
    try {
      const res = await axios.get("/web/admin/users/detail", { params: { providerCode, providerUserId } });
      setSelectedDetail(res.data);
      setModalOpen(true);
    } catch (err) {
      console.error("❌ 사용자 상세 조회 실패:", err);
      alert("상세 정보 조회에 실패했습니다.");
    }
  };

  const handleSortChange = (e) => {
    const newSortOrder = e.target.value;
    const newFilters = {...filters, sortOrder: newSortOrder};
    setFilters(newFilters);
    fetchUsers(newFilters);
  };

  const paginatedUsers = filtered.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filtered.length / itemsPerPage));

  return (
    <div className="bg-slate-50 min-h-screen select-none">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">사용자 관리</h1>
          <p className="text-gray-500 mt-1">회원 정보를 검색하고 관리합니다.</p>
        </header>

        <div className="bg-white p-6 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={handleSearch}>
            <div className="space-y-5">
              <div className="flex flex-wrap items-start gap-x-8 gap-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">가입일 조회</label>
                  <div className="flex items-center gap-2">
                    <input type="date" name="startDate" value={filters.startDate} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <span className="text-gray-500">~</span>
                    <input type="date" name="endDate" value={filters.endDate} onChange={handleFilterChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-600 mb-1">사용자 속성</label>
                  <div className="flex items-center flex-wrap gap-2">
                    <select name="userRole" value={filters.userRole} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">전체 권한</option>
                      <option value="1">일반</option>
                      <option value="2">관계자</option>
                      <option value="3">관리자</option>
                    </select>
                    <select name="userStatus" value={filters.userStatus} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                      <option value="">전체 상태</option>
                      <option value="0">활성</option>
                      <option value="1">비활성</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="flex flex-wrap justify-between items-center mt-4 pt-4 border-t border-gray-200 gap-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                    <input type="text" name="keyword" placeholder="닉네임 or 이메일" value={filters.keyword} onChange={handleFilterChange} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                  </div>
                  <select value={filters.sortOrder} onChange={handleSortChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                    <option value="DESC">최신순</option>
                    <option value="ASC">오래된순</option>
                  </select>
                </div>
                <div className="flex gap-2">
                  <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors cursor-pointer">검색</button>
                  <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">초기화</button>
                </div>
              </div>
            </div>
          </form>
        </div>

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
              {isLoading ? (
                Array.from({ length: 14 }).map((_, index) => <Skeleton key={index} />)
              ) : paginatedUsers.length === 0 ? (
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
          {!isLoading && totalPages > 1 && (
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
            refreshList={() => fetchUsers(filters)}
          />
        )}
      </main>
    </div>
  );
}