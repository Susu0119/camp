import React, { useEffect, useState } from "react";
import { WelcomeSection } from "../../components/MyPage/UI/MP_Main_WelcomSection";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import axios from "axios";

export default function MyPageMain() {
  const [userData, setUserData] = useState({
    nickname: "",
    profileImage: "/images/default-profile.jpg", // 기본 이미지
  });

  useEffect(() => {
    axios
      .get("http://localhost:8080/web/api/user/mypage/mypage/main", { withCredentials: true })
      .then((response) => {
        const { nickname, profileImage } = response.data;
        setUserData({
          nickname,
          profileImage: profileImage || "/images/default-profile.jpg",
        });
      })
      .catch((error) => {
        console.error("마이페이지 정보 불러오기 실패:", error);
      });
  }, []);

  return (
    <div className="h-screen flex flex-col">
      <MPHeader />
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
