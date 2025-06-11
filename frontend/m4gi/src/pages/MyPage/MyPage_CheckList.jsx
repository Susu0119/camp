import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/Common/Header';
import MPSidebar from '../../components/MyPage/UI/MP_SideBar';
import { apiCore } from '../../utils/Auth';

const ChecklistPage = () => {
  const { reservationId } = useParams();

  // reservationId 값 확인용 로그
  console.log('reservationId:', reservationId);

  const [checklist, setChecklist] = useState(null);
  const [reservationInfo, setReservationInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      if (!reservationId) {
        setError("예약 ID가 없습니다.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);

        console.log("체크리스트 및 예약 정보 조회 중...");

        // 1. 체크리스트 조회
        const checklistResponse = await apiCore.get(`/api/camping-checklist/reservation/${reservationId}`);

        // 2. 예약 정보 조회 (ongoing으로 예약 목록 가져와서 해당 예약 찾기)
        const reservationResponse = await apiCore.post('/api/UserMypageReservations/ongoing');

        if (checklistResponse.data.success) {
          console.log("체크리스트 발견:", checklistResponse.data);
          setChecklist(checklistResponse.data);

          // 해당 예약 ID와 일치하는 예약 정보 찾기
          const targetReservation = reservationResponse.data && Array.isArray(reservationResponse.data)
            ? reservationResponse.data.find(reservation => reservation.reservationId === reservationId)
            : null;

          if (targetReservation) {
            console.log("예약 정보 발견:", targetReservation);
            setReservationInfo(targetReservation);
          } else {
            console.warn("해당 예약 ID의 예약 정보를 찾을 수 없습니다:", reservationId);
          }
        } else {
          setError("체크리스트가 아직 생성되지 않았습니다. 결제 완료 후 잠시 기다려주세요.");
        }

      } catch (err) {
        console.error("체크리스트 조회 실패:", err);
        setError("체크리스트를 찾을 수 없습니다. 결제가 완료되었는지 확인해주세요.");
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, [reservationId]);


  return (
    <div className="h-screen flex flex-col">
      <Header showSearchBar={false} />

      <div className="flex flex-1">
        <MPSidebar />

        <div className="flex-1 flex flex-col items-center justify-start p-10 gap-6 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">체크리스트</h2>

            {loading ? (
              <div className="text-center py-8">
                <p className="text-lg">체크리스트를 불러오고 있습니다...</p>
                <div className="mt-4 text-sm text-gray-600">잠시만 기다려주세요</div>
              </div>
            ) : error ? (
              <div className="text-center py-8">
                <p className="text-red-500 text-lg mb-4">❌ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  다시 시도
                </button>
              </div>
            ) : checklist && reservationInfo ? (
              <div className="space-y-6">
                {/* 캠핑장 정보 */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                  {/* 헤더 */}
                  <div className="bg-cpurple px-6 py-4">
                    <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                      캠핑 정보
                    </h3>
                  </div>

                  {/* 컨텐츠 */}
                  <div className="p-6 space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-cpurple" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">캠핑장</p>
                          <p className="font-semibold text-gray-900">{reservationInfo.campgroundName}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">위치</p>
                          <p className="font-semibold text-gray-900">{reservationInfo.addrFull}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">기간</p>
                          <p className="font-semibold text-gray-900">
                            {new Date(reservationInfo.reservationDate).toLocaleDateString()} ~ {new Date(reservationInfo.endDate).toLocaleDateString()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                          <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                          </svg>
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">인원</p>
                          <p className="font-semibold text-gray-900">{reservationInfo.totalPeople || "0"}명</p>
                        </div>
                      </div>
                    </div>

                    {checklist.generatedAt && (
                      <div className="mt-4 pt-4 border-t border-gray-200">
                        <div className="flex items-center gap-2">
                          <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                          <span className="text-sm text-gray-500">생성일: {checklist.generatedAt}</span>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* AI 추천사항 */}
                {checklist.recommendations && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* 헤더 */}
                    <div className="bg-cpurple px-6 py-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        특별 추천사항
                      </h3>
                    </div>

                    {/* 컨텐츠 */}
                    <div className="p-6">
                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {Array.isArray(checklist.recommendations)
                            ? checklist.recommendations.join('. ')
                            : checklist.recommendations}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* AI 조언 */}
                {checklist.advice && (
                  <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    {/* 헤더 */}
                    <div className="bg-cpurple px-6 py-4">
                      <h3 className="text-xl font-semibold text-white flex items-center gap-3">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AI 조언
                      </h3>
                    </div>

                    {/* 컨텐츠 */}
                    <div className="p-6">
                      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                        <div className="text-gray-700 whitespace-pre-line leading-relaxed">
                          {checklist.advice}
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* 토큰 사용량 정보 (개발용) */}
                {checklist.tokenUsage && (
                  <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                    <div className="bg-gray-50 px-4 py-2">
                      <h4 className="text-sm font-medium text-gray-600 flex items-center gap-2">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        개발 정보
                      </h4>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500">
                        토큰 사용량: 입력 {checklist.tokenUsage.inputTokens}, 출력 {checklist.tokenUsage.outputTokens}, 총 {checklist.tokenUsage.totalTokens}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-center py-8 text-gray-500">체크리스트 정보가 없습니다.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
