import React from "react";
import { WelcomeSection } from "../../components/MyPage/UI/MP_Main_WelcomSection";
import CSSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";

export default function MyPageMain() {
  return (
    <div className="h-screen flex flex-col">
      <MPHeader />
      <div className="flex flex-1">
        <CSSidebar />
        <div className="flex-1">
          <WelcomeSection
            nickname="홍길동"
            profileImage="/images/default-profile.jpg"
          />
        </div>
      </div>
    </div>
  );
}
