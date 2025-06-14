import { useEffect, useState, useMemo } from "react";
import { apiCore } from "../../../utils/Auth";
import Sidebar from "./Admin_Sidebar";
import AdminCampgroundModal from "./Admin_CampgroundModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

// 상태 라벨 컴포넌트 (변경 없음)
const getStatusLabel = (s) => {
  switch (Number(s)) {
    case 0: return <span className="text-green-600 font-semibold">운영중</span>;
    case 1: return <span className="text-yellow-600 font-semibold">휴무중</span>;
    case 2: return <span className="text-gray-500 font-semibold">비활성화</span>;
    default: return <span className="text-red-500">알 수 없음</span>;
  }
};

// 스켈레톤 UI 컴포넌트 (변경 없음)
const Skeleton = () => (
  <tr className="animate-pulse">
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-3/4 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-full"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/2 mx-auto"></div></td>
    <td className="px-6 py-4"><div className="h-4 bg-slate-200 rounded w-1/3 mx-auto"></div></td>
  </tr>
);

export default function AdminCampgroundList() {
  const itemsPerPage = 14;

  // --- 상태 관리 (State) ---
  const [campgrounds, setCampgrounds] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  // [수정] 필터 상태를 UI용과 적용용으로 분리
  const initialFilters = { keyword: "", status: "", sortOrder: "DESC" };
  
  // 사용자가 입력창/셀렉트박스에서 선택 중인 필터 값
  const [filters, setFilters] = useState(initialFilters); 
  
  // '검색' 버튼을 눌렀을 때 실제 목록에 적용되는 필터 값
  const [appliedFilters, setAppliedFilters] = useState(initialFilters); 

  const filteredCampgrounds = useMemo(() => {
    let result = [...campgrounds];
    const { keyword, status, sortOrder } = appliedFilters; // 적용된 필터 값을 사용

    if (status) {
      result = result.filter(camp => String(camp.status) === status);
    }
    if (keyword) {
      const lowercasedKeyword = keyword.toLowerCase();
      result = result.filter(camp =>
        (camp.name && camp.name.toLowerCase().includes(lowercasedKeyword)) ||
        (camp.roadAddress && camp.roadAddress.toLowerCase().includes(lowercasedKeyword))
      );
    }
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return sortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });
    return result;
  }, [campgrounds, appliedFilters]); // 의존성: 원본 데이터, '적용된' 필터

  // 최초 데이터 로드 (변경 없음)
  useEffect(() => {
    const fetchAllCampgrounds = async () => {
      setIsLoading(true);
      try {
        const res = await apiCore.get("/admin/campgrounds/search");
        const data = Array.isArray(res.data) ? res.data : (res.data.campgrounds || []);
        setCampgrounds(data);
      } catch (err) {
        console.error("❌ 캠핑장 목록 전체 로드 실패:", err);
        alert("데이터를 불러오는 데 실패했습니다.");
        setCampgrounds([]);
      } finally {
        setTimeout(() => setIsLoading(false), 1000);
      }
    };
    fetchAllCampgrounds();
  }, []);

  // [수정] 검색 버튼 핸들러: UI 필터 값을 실제 필터로 적용
  const handleSearch = (e) => {
    e.preventDefault();
    setAppliedFilters(filters); // 현재 UI의 필터 값을 '적용'
    setCurrentPage(1);
  };

  // [수정] 필터 초기화 핸들러: UI와 실제 필터 모두 초기화
  const resetFilters = () => {
    setFilters(initialFilters);
    setAppliedFilters(initialFilters);
    setCurrentPage(1);
  };
  
  // UI 컨트롤(입력창, 셀렉트)의 값을 변경하는 핸들러
  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prevFilters => ({
      ...prevFilters,
      [name]: value,
    }));
  };

  // 행 클릭 핸들러 (변경 없음)
  const handleRowClick = async (id) => {
    try {
      const res = await apiCore.get(`/admin/campgrounds/${id}/detail`);
      setSelectedDetail({ ...res.data, status: Number(res.data.status) });
      setModalOpen(true);
    } catch (err) {
      alert("❌ 상세정보를 불러오는 데 실패했습니다.");
    }
  };

  // 목록 새로고침 함수 (변경 없음)
  const refreshList = async () => {
    setIsLoading(true);
    try {
      const res = await apiCore.get("/admin/campgrounds/search");
      const data = Array.isArray(res.data) ? res.data : (res.data.campgrounds || []);
      setCampgrounds(data);
    } catch (err) {
      console.error("❌ 캠핑장 목록 새로고침 실패:", err);
      alert("데이터를 새로고침하는 데 실패했습니다.");
    } finally {
      setTimeout(() => setIsLoading(false), 1000);
    }
  };
  
  // 페이지네이션 관련 변수 (변경 없음)
  const paginatedCampgrounds = filteredCampgrounds.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredCampgrounds.length / itemsPerPage));

  return (
    <div className="bg-slate-50 min-h-screen select-none">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72 flex flex-col items-center">
        <header className="mb-8 w-full">
          <h1 className="text-3xl font-bold text-gray-800">캠핑장 관리</h1>
          <p className="text-gray-500 mt-1">등록된 캠핑장 정보를 검색하고 관리합니다.</p>
        </header>

        {/* --- 검색 및 필터 영역 --- */}
        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8 w-full">
          <form onSubmit={handleSearch}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"><SearchIcon /></span>
                  {/* [수정] value와 onChange를 filters 상태와 연결 */}
                  <input type="text" name="keyword" placeholder="캠핑장명 or 주소" value={filters.keyword} onChange={handleFilterChange} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <select name="status" value={filters.status} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">전체 상태</option>
                  <option value="0">운영중</option>
                  <option value="1">휴무중</option>
                  <option value="2">비활성화</option>
                </select>
                <select name="sortOrder" value={filters.sortOrder} onChange={handleFilterChange} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="DESC">최신 등록순</option>
                  <option value="ASC">오래된 순</option>
                </select>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-purple-600 text-white font-semibold rounded-lg shadow-sm hover:bg-purple-700 transition-colors cursor-pointer">검색</button>
                <button type="button" onClick={resetFilters} className="px-4 py-2 bg-gray-200 text-gray-700 font-semibold rounded-lg hover:bg-gray-300 transition-colors cursor-pointer">초기화</button>
              </div>
            </div>
          </form>
        </div>

        {/* --- 테이블 영역 (이하 변경 없음) --- */}
        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden w-full">
          <table className="w-full text-sm">
            <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider">
              <tr>
                <th className="px-6 py-3 text-center font-medium">캠핑장</th>
                <th className="px-6 py-3 text-left font-medium">주소</th>
                <th className="px-6 py-3 text-center font-medium">전화번호</th>
                <th className="px-6 py-3 text-center font-medium">상태</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {isLoading ? (
                Array.from({ length: 14 }).map((_, index) => <Skeleton key={index} />)
              ) : paginatedCampgrounds.length === 0 ? (
                <tr>
                  <td colSpan="4" className="text-center text-gray-500 py-16">
                    검색 결과가 없습니다.
                  </td>
                </tr>
              ) : (
                paginatedCampgrounds.map((camp) => (
                  <tr key={camp.id} onClick={() => handleRowClick(camp.id)} className="hover:bg-purple-50 transition cursor-pointer">
                    <td className="px-6 py-4 whitespace-nowrap text-center font-semibold">{camp.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-left text-gray-600">{camp.roadAddress}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center text-gray-600">{camp.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-center">{getStatusLabel(camp.status)}</td>
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

        {modalOpen && selectedDetail && (
          <AdminCampgroundModal
            key={selectedDetail.id}
            isOpen={modalOpen}
            onClose={() => {
              setModalOpen(false);
              setSelectedDetail(null);
            }}
            detail={selectedDetail}
            refreshList={refreshList}
          />
        )}
      </main>
    </div>
  );
}