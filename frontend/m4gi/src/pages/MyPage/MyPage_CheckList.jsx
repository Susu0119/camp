import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import Header from '../../components/Common/Header';
import MPSidebar from '../../components/MyPage/UI/MP_SideBar';

const ChecklistPage = () => {
  const { reservationId } = useParams();

  // reservationId 값 확인용 로그
  console.log('reservationId:', reservationId);

  const [checklist, setChecklist] = useState([]);


useEffect(() => {
  const fetchChecklist = async () => {
    try {
        const res = await fetch(`http://localhost:8080/web/api/camping-checklist/generate-by-reservation/${reservationId}`);

        if (!res.ok)
            throw new Error("네트워크 응답 에러");
        const data = await res.json();
        console.log("체크리스트:", data);
        setChecklist(data);  // 여기서 상태 업데이트
    } catch (err) {
        console.error("체크리스트 로딩 실패:", err);
    }
};


  fetchChecklist();
}, [reservationId]);


  return (
    <div className="h-screen flex flex-col">
      <Header showSearchBar={false} />

      <div className="flex flex-1">
        <MPSidebar />

        <div className="flex-1 flex flex-col items-center justify-start p-10 gap-6 overflow-y-auto">
          <div className="w-full max-w-4xl">
            <h2 className="text-2xl font-semibold mb-4">체크리스트</h2>
            {checklist.length === 0 ? (
              <p>체크리스트가 없습니다.</p>
            ) : (
              checklist.map((category, catIdx) => (
                <div key={catIdx} className="mb-6">
                  <h3 className="text-xl font-semibold mb-2">{category.categoryName}</h3>
                  <ul className="list-disc list-inside space-y-1">
                    {category.items.map((item, itemIdx) => (
                      <li key={itemIdx} className="text-gray-700">
                        ✔ {item.itemName} ({item.quantity} {item.unit}) - {item.priority}
                      </li>
                    ))}
                  </ul>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChecklistPage;
