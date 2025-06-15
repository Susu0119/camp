import { useParams, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/Common/Header';
import MPSidebar from '../../components/MyPage/UI/MP_SideBar';
import { apiCore } from '../../utils/Auth';
import LocalLoading from '../../utils/LocalLoading';

/**
 * AI 추천/조언 내용을 표시하는 카드입니다.
 */
const AiContentCard = ({ title, children }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
    <h3 className="text-xl font-bold text-gray-800 mb-4">{title}</h3>
    <div className="text-gray-700 whitespace-pre-line leading-relaxed">
      {children}
    </div>
  </div>
);

const ChecklistPage = () => {
  const { reservationId } = useParams();
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
        const checklistResponse = await apiCore.get(`/api/camping-checklist/reservation/${reservationId}`);
        const reservationResponse = await apiCore.post('/api/UserMypageReservations/ongoing');
        
        const targetReservation = reservationResponse.data?.find(
          (reservation) => reservation.reservationId == reservationId
        );

        if (targetReservation) {
          setReservationInfo(targetReservation);
        } else {
            const completedResponse = await apiCore.post('/api/UserMypageReservations/completed');
            const completedReservation = completedResponse.data?.find(
                (reservation) => reservation.reservationId == reservationId
            );
            if(completedReservation) setReservationInfo(completedReservation);
        }

        if (checklistResponse.data) {
          setChecklist(checklistResponse.data);
        } else {
          setError("체크리스트가 아직 생성되지 않았습니다.");
        }
      } catch (err) {
        setError("체크리스트를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, [reservationId]);

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <MPSidebar />
        <main className="flex-1 p-4 sm:p-6 lg:p-8">
          <div className="max-w-4xl mx-auto flex flex-col justify-center min-h-[60vh]">
            <header className="mb-8">
              <h1 className="text-3xl font-bold text-gray-800">AI 캠핑 체크리스트</h1>
              <p className="text-gray-500 mt-1">캠핑을 더 완벽하게 만들어 줄 AI의 조언을 확인해보세요.</p>
            </header>

            {loading ? (
              <div className="flex justify-center items-center min-h-[40vh]">
                <LocalLoading />
              </div>
            ) : error ? (
              <div className="text-center py-20 bg-white border border-red-200 rounded-2xl">
                <p className="text-red-500 text-lg mb-4">❌ {error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="px-5 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700"
                >
                  다시 시도
                </button>
              </div>
            ) : reservationInfo && checklist && (checklist.recommendations || checklist.advice) ? (
              <div className="space-y-8">
                {/* 2. AI 추천사항 */}
                {checklist.recommendations && (
                  <AiContentCard title="✨ 특별 추천사항">
                    {Array.isArray(checklist.recommendations)
                      ? checklist.recommendations.join('. ')
                      : checklist.recommendations}
                  </AiContentCard>
                )}
                {/* 3. AI 조언 */}
                {checklist.advice && (
                  <AiContentCard title="💡 AI 조언">
                     {checklist.advice}
                  </AiContentCard>
                )}
              </div>
            ) : (
              <div className="flex justify-center items-center min-h-[40vh]">
                <LocalLoading />
              </div>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default ChecklistPage;