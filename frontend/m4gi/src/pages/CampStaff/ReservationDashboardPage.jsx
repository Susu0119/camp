import React from "react";
import Header from "../../components/Common/Header";
import OwnerSideBar from "../../components/MyPage/UI/MP_Owner_SideBar";
import ReservationList from "../../components/CampStaff/UI/ReservationList";

export default function ReservationDashboard () {
  return (
    <main className="w-full">
      <Header showSearchBar = {false}/>
      <div className="flex">
        <OwnerSideBar />
        <ReservationList />
      </div>
    </main>
  );
};
