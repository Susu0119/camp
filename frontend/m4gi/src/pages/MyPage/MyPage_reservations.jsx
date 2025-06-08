// src/pages/mypage/MyPageReservations.jsx
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from '../../components/Common/Header';
import ReservationFilter from "../../components/MyPage/UI/MP_ReservationFilter";
import ReservationCard from "../../components/MyPage/UI/MP_ReservationCard";

// 예약 상태 숫자 -> 문자열 매핑 함수
const mapStatus = (statusNum, checkinStatus) => {
  if (checkinStatus === 3) {
    return "completed"; // 체크아웃 완료
  }

  switch (statusNum) {
    case 1:
      return "active";     // 예약중
    case 2:
      return "completed";  // 이용 완료
    case 3:
      return "cancelled";  // 예약 취소
    default:
      return "unknown";
  }
};

// 캠핑장 이미지 JSON에서 적절한 이미지 추출 함수
//const parseCampgroundImage = (imageJson) => {
//  if (!imageJson) return null;
//  try {
//    const obj = typeof imageJson === 'string' ? JSON.parse(imageJson) : imageJson;

//    if (obj.thumbnail && obj.thumbnail.length > 0) return obj.thumbnail[0];
//    if (obj.map && obj.map.length > 0) return obj.map[0];
//    if (obj.detail && obj.detail.length > 0) return obj.detail[0];
//  } catch (e) {
//    console.error("이미지 JSON 파싱 실패:", e);
//  }
//  return null;
//};


export default function MyPageReservations() {
  const [activeFilter, setActiveFilter] = useState("active"); // active, completed, cancelled
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReservations = async () => {
      setLoading(true);

      let url = "";
      if (activeFilter === "active") {
        url = "/web/api/UserMypageReservations/ongoing";
      } else if (activeFilter === "completed") {
        url = "/web/api/UserMypageReservations/completed";
      } else if (activeFilter === "cancelled") {
        url = "/web/api/UserMypageReservations/canceled";
      } else {
        setReservations([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`http://localhost:8080${url}`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
          },
        });

        if (!res.ok) {
          const msg = await res.text();
          throw new Error(msg || "서버 오류 발생");
        }

        const data = await res.json();
        setReservations(data);
      } catch (err) {
        alert("예약 정보를 불러오지 못했습니다: " + err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReservations();
  }, [activeFilter]);

  return (
    <div className="h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <MPSidebar />
        <div className="flex-1 flex flex-col items-center justify-start p-10 gap-6">
          <ReservationFilter
            activeFilter={activeFilter}
            onFilterChange={setActiveFilter}
          />
          <div className="w-full max-w-4xl">
            <div>
              {loading ? (
                <p>로딩 중...</p>
              ) : reservations.length === 0 ? (
                <p>예약 내역이 없습니다.</p>
              ) : (
                reservations.map((resv) => {
                  // 취소된 예약
                  if (activeFilter === "cancelled") {
                    return (
                      <ReservationCard
                        key={`${resv.reservationId || resv.reservationDate}-${resv.siteName || resv.campgroundName}`}
                        imageUrl={parseCampgroundImage(resv.campground_image) || "/images/default.jpg"}
                        title={resv.campgroundName || "캠핑장 이름 없음"}
                        location={resv.siteName || "사이트 이름 없음"}
                        dates={resv.reservationDate ? new Date(resv.reservationDate).toLocaleDateString() : "날짜 정보 없음"}
                        amount={"-"}
                        status={"cancelled"}
                        refundStatus={resv.refundStatus || 0}
                        checkinStatus={resv.checkinStatus || null}
                        onCancel={null}
                      />
                    );
                  } else {
                    // 진행중 또는 완료 예약
                    return (
                      <ReservationCard
                        key={`${resv.reservationId}-${resv.reservationDate}`}
                        //imageUrl={parseCampgroundImage(resv.campground_image) || "/images/default.jpg"}
                        title={resv.campgroundName || "캠핑장 이름 없음"}
                        location={resv.addrFull || "위치 정보 없음"}
                        dates={
                          resv.reservationDate && resv.endDate
                            ? `${new Date(resv.reservationDate).toLocaleDateString()} ~ ${new Date(resv.endDate).toLocaleDateString()}`
                            : "날짜 정보 없음"
                        }
                        amount={resv.totalPrice ? `${resv.totalPrice.toLocaleString()}원` : "금액 정보 없음"}
                        status={mapStatus(resv.reservationStatus, resv.checkinStatus)}
                        refundStatus={null}
                        checkinStatus={resv.checkinStatus || null}
                        onCancel={() => {
                          navigate(`/mypage/cancel/${resv.reservationId}`);
                        }}
                      />
                    );
                  }
                })
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
