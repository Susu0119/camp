import React from "react";
import Header from "../../components/Common/Header";
import Sidebar from "../../components/MyPage/MP_SideBar";
import ReservationList from "../../components/CampStaff/ReservationList";

export default function ReservationDashboard () {
  return (
    <main className="w-full">
      <Header showSearchBar = {false}/>
      <div className="flex">
        <Sidebar />
        <ReservationList />
      </div>
    </main>
  );
};
