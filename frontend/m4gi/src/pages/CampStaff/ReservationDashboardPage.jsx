import React from "react";
import Header from "../../components/Common/Header";
import OwnerSideBar from "../../components/MyPage/UI/MP_Owner_SideBar";
import ReservationManagementSection from "../../components/CampStaff/UI/ReservationManagementSection";

export default function ReservationDashboard () {
  return (
    <main className="w-full">
      <Header showSearchBar = {false}/>
      <div className="flex">
        <OwnerSideBar />
        <ReservationManagementSection />
      </div>
    </main>
  );
};
