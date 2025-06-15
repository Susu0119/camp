import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom"; // Link 컴포넌트를 import 합니다.
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from "../../components/Common/Header";
import { apiCore } from "../../utils/Auth";
import { useAuth } from "../../utils/Auth";

// --- 재사용 컴포넌트들 ---

// 1. 사용자 환영 섹션
const WelcomeSection = ({ nickname, profileImage }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 sm:p-8 shadow-sm flex items-center justify-between">
    <div className="flex items-center gap-6">
      <img
        src={profileImage}
        alt="Profile"
        className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover border-2 border-gray-200"
      />
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">안녕하세요, {nickname}님!</h2>
        <p className="text-gray-500 mt-1">오늘도 즐거운 캠핑 계획을 세워보세요.</p>
      </div>
    </div>
    <Link to="/mypage/profile"> {/* 내 정보 수정 페이지 경로 */}
      <button className="hidden sm:inline-block px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">
        내 정보 수정
      </button>
    </Link>
  </div>
);

// 2. 통계 정보 카드
const StatCard = ({ title, count, linkTo, icon, hideLink }) => (
    <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between">
        <div>
            <div className="flex items-center gap-3 text-gray-500">
                {icon}
                <span className="font-semibold">{title}</span>
            </div>
            <p className="text-4xl font-bold text-purple-600 mt-4">{count}<span className="text-2xl text-gray-500 ml-1">건</span></p>
        </div>
        {!hideLink && linkTo && (
          <Link to={linkTo} className="mt-6 text-sm font-semibold text-gray-600 hover:text-purple-600 flex items-center gap-1">
              바로가기
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
          </Link>
        )}
    </div>
);

export default function MyPageMain() {
  const { user } = useAuth();
  const [summaryData, setSummaryData] = useState({
    ongoingCount: 0,
    completedCount: 0,
    reviewCount: 0,
  });

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const ongoingRes = await apiCore.post("/api/UserMypageReservations/ongoing");
        const completedRes = await apiCore.post("/api/UserMypageReservations/completed");
        const reviewCountRes = await apiCore.get("/api/reviews/count");
        setSummaryData({
          ongoingCount: Array.isArray(ongoingRes.data) ? ongoingRes.data.length : 0,
          completedCount: Array.isArray(completedRes.data) ? completedRes.data.length : 0,
          reviewCount: typeof reviewCountRes.data === 'number' ? reviewCountRes.data : 0,
        });
      } catch (err) {
        setSummaryData({
          ongoingCount: 0,
          completedCount: 0,
          reviewCount: 0,
        });
      }
    };
    fetchSummary();
  }, []);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <CSSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-5xl mx-auto space-y-8">
            {/* 1. 환영 메시지 섹션 */}
            <WelcomeSection
              nickname={user?.nickname || "캠퍼"}
              profileImage={user?.profileImage}
            />

            {/* 2. 활동 요약 섹션 */}
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-4">나의 활동 요약</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <StatCard 
                  title="이용 예정 예약" 
                  count={summaryData.ongoingCount} 
                  linkTo="/mypage/reservations" 
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                />
                <StatCard 
                  title="이용 완료" 
                  count={summaryData.completedCount} 
                  linkTo="/mypage/reservations?filter=completed"
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>}
                />
                <StatCard 
                  title="작성한 리뷰" 
                  count={summaryData.reviewCount} 
                  hideLink={true}
                  icon={<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.196-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.783-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"></path></svg>}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}