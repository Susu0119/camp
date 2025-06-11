"use client";
import React from "react";
import Header from "../../components/Common/Header";
import OwnerSideBar from "../../components/MyPage/UI/MP_Owner_SideBar";
import RegistrationForm from "../../components/CampStaff/UI/RegistrationForm";

export default function CampingRegistrationPage() {
  return (
    <main>
        <Header showSearchBar={false} />
        <div className="flex w-full">
            <OwnerSideBar />       
            <div className="mx-auto">
                <RegistrationForm />
            </div>     
        </div>
    </main>
  );
}
