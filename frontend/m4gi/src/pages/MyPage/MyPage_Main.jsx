import React, { useEffect, useState } from "react";
import { WelcomeSection } from "../../components/MyPage/UI/MP_Main_WelcomSection";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import Header from "../../components/Common/Header";
import { apiCore } from "../../utils/Auth";

export default function MyPageMain() {
  const [userData, setUserData] = useState({
    nickname: "",
    profileImage: "/images/default-profile.jpg", // 기본 이미지
  });

  useEffect(() => {
    apiCore
      .get("/api/user/mypage/main")
      .then((response) => {
        console.log("응답 데이터:", response.data);
        const { nickname, profileImage } = response.data;
        setUserData({
          nickname,
          profileImage: profileImage || "",  // null이면 빈 문자열로 설정
        });
      })
      .catch((error) => {
        console.error("마이페이지 정보 불러오기 실패:", error);
      });
  }, []);


  return (
    <div className="h-screen flex flex-col">
      <Header showSearchBar={false} />
      <div className="flex flex-1">
        <CSSidebar />
        <div className="flex-1">
          <WelcomeSection
            nickname={userData.nickname}
            profileImage={userData.profileImage}
          />
        </div>
      </div>
    </div>
  );
}
