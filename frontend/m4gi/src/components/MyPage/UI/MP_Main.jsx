import React, { useEffect, useState } from "react";
import axios from "axios";
import { WelcomeSection } from "./MP_Main_WelcomSection";

export default function MyPageMain() {
  const [userInfo, setUserInfo] = useState(null);
  const [isFirstVisit, setIsFirstVisit] = useState(false);

  useEffect(() => {
    axios
      .get("/api/user/mypage/mypage/main", { withCredentials: true })
      .then((res) => {
        setUserInfo(res.data);
        setIsFirstVisit(res.data.isFirstVisit);
      })
      .catch((err) => console.error("마이페이지 메인 정보 로딩 실패", err));
  }, []);

  if (!userInfo) {
    return <div className="p-8">로딩 중...</div>;
  }

  return (
    <div className="p-8">
      <div className="flex items-center space-x-4 mb-4">
        {isFirstVisit && (
          <WelcomeSection
            nickname={userInfo.nickname}
            profileImage={userInfo.profileImage}
          />
        )}
      </div>
      <p>사이드바에서 원하는 기능을 클릭하세요.</p> {/*수정 필요*/}
    </div>
  );
}
