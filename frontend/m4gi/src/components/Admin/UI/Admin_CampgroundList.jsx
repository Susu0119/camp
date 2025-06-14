import { useEffect, useState } from "react";
import { apiCore } from "../../../utils/Auth";
import Sidebar from "./Admin_Sidebar";
import AdminCampgroundModal from "./Admin_CampgroundModal";
import Pagination from './Admin_Pagination';
import SearchIcon from '@mui/icons-material/Search';

// [수정] 상태 라벨 스타일 일관성 적용
const getStatusLabel = (s) => {
  switch (Number(s)) {
    case 0: return <span className="text-green-600 font-semibold">운영중</span>;
    case 1: return <span className="text-yellow-600 font-semibold">휴무중</span>;
    case 2: return <span className="text-gray-500 font-semibold">비활성화</span>;
    default: return <span className="text-red-500">알 수 없음</span>;
  }
};

export default function AdminCampgroundList() {
  const itemsPerPage = 14;
  const [campgrounds, setCampgrounds] = useState([]);
  const [filteredCampgrounds, setFilteredCampgrounds] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedDetail, setSelectedDetail] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 필터링 및 정렬을 위한 상태
  const [keyword, setKeyword] = useState("");
  const [status, setStatus] = useState("");
  const [sortOrder, setSortOrder] = useState("DESC");

  // 필터링과 정렬을 수행하는 함수
  const applyFiltersAndSort = (baseData, currentKeyword, currentStatus, currentSortOrder) => {
    let result = [...baseData];

    // 1. 상태(status) 필터링
    if (currentStatus) {
      result = result.filter(camp => String(camp.status) === currentStatus);
    }

    // 2. 키워드(keyword) 필터링
    if (currentKeyword) {
      result = result.filter(camp =>
        (camp.name && camp.name.toLowerCase().includes(currentKeyword.toLowerCase())) ||
        (camp.roadAddress && camp.roadAddress.toLowerCase().includes(currentKeyword.toLowerCase()))
      );
    }

    // 3. 정렬(sortOrder)
    result.sort((a, b) => {
      const dateA = new Date(a.createdAt || 0);
      const dateB = new Date(b.createdAt || 0);
      return currentSortOrder === 'DESC' ? dateB - dateA : dateA - dateB;
    });

    setFilteredCampgrounds(result);
    setCurrentPage(1);
  };

  // 최초 데이터 로드
  useEffect(() => {
    const fetchAllCampgrounds = async () => {
      setIsLoading(true);
      try {
        const res = await apiCore.get("/admin/campgrounds/search");
        const data = Array.isArray(res.data) ? res.data : (res.data.campgrounds || []);
        setCampgrounds(data);
        // 초기에 전체 데이터를 보여주기 위해 필터링/정렬 함수 호출
        applyFiltersAndSort(data, "", "", "DESC");
      } catch (err) {
        console.error("❌ 캠핑장 목록 전체 로드 실패:", err);
        alert("데이터를 불러오는 데 실패했습니다.");
        setCampgrounds([]);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllCampgrounds();
  }, []);

  // 정렬 순서 변경 시 즉시 반영
  useEffect(() => {
    // campgrounds 데이터가 있을 때만 정렬 실행
    if (campgrounds.length > 0) {
      applyFiltersAndSort(campgrounds, keyword, status, sortOrder);
    }
  }, [sortOrder]);


  // 검색 버튼 클릭 시 필터링 적용
  const handleSearch = (e) => {
    e.preventDefault();
    applyFiltersAndSort(campgrounds, keyword, status, sortOrder);
  };

  // 필터 초기화
  const resetFilters = () => {
    setKeyword("");
    setStatus("");
    setSortOrder("DESC");
    // 초기화된 값으로 즉시 필터링 적용
    applyFiltersAndSort(campgrounds, "", "", "DESC");
  };

  const handleRowClick = async (id) => {
    try {
      const res = await apiCore.get(`/admin/campgrounds/${id}/detail`);
      setSelectedDetail({ ...res.data, status: Number(res.data.status) });
      setModalOpen(true);
    } catch (err) {
      alert("❌ 상세정보 불러오기 실패");
    }
  };

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
      setIsLoading(false);
    }
  };

  const paginatedCampgrounds = filteredCampgrounds.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredCampgrounds.length / itemsPerPage));

  return (
    <div className="bg-slate-50 min-h-screen select-none">
      <Sidebar />
      <main className="flex-1 p-4 sm:p-6 lg:p-8 ml-72">
        <header className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800">캠핑장 관리</h1>
          <p className="text-gray-500 mt-1">등록된 캠핑장 정보를 검색하고 관리합니다.</p>
        </header>

        <div className="bg-white p-4 rounded-xl border border-gray-200 mb-8">
          <form onSubmit={handleSearch}>
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-2">
                <div className="relative">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
                    <SearchIcon />
                  </span>
                  <input type="text" placeholder="캠핑장명 or 주소" value={keyword} onChange={(e) => setKeyword(e.target.value)} className="pl-10 pr-3 py-2 border border-gray-300 rounded-lg w-64 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                </div>
                <select value={status} onChange={(e) => setStatus(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
                  <option value="">전체 상태</option>
                  <option value="0">운영중</option>
                  <option value="1">휴무중</option>
                  <option value="2">비활성화</option>
                </select>
                <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500">
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
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
                <tr><td colSpan="4" className="text-center text-gray-500 py-16">데이터를 불러오는 중입니다...</td></tr>
              ) : paginatedCampgrounds.length === 0 ? (
                <tr><td colSpan="4" className="text-center text-gray-500 py-16">캠핑장 정보가 없습니다.</td></tr>
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