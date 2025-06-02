import React from "react";
import Header from "../../components/Common/Header";
import { Button } from "../../components/Common/Button";
import FormInput from "../../components/Common/FormInput";
import MP_Sidebar from "../../components/MyPage/UI/MP_SideBar";
import MP_Main from "../../components/MyPage/UI/MP_Main";

export default function TestPage() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* 상단 헤더 */}
      <Header />

      {/* 사이드바 + 콘텐츠 영역 */}
      <div className="flex flex-1">
        {/* 왼쪽 사이드바 */}
        <MP_Sidebar />

        {/* 오른쪽 메인 콘텐츠 */}
        <div className="flex-1 p-8">
         <MP_Main/>
        </div>
      </div>
    </div>
  );
}
