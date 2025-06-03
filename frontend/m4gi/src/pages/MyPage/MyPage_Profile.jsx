"use client";
import React, { useState, useEffect } from 'react';
import MPSidebar from "../../components/MyPage/UI/MP_SideBar";
import MPHeader from "../../components/MyPage/UI/MP_Header";
import ProfileForm from '../../components/MyPage/UI/MP_ProfileForm';

const MyPageProfilePage = () => {
  return (
    <>
      <link
        href="https://fonts.googleapis.com/css2?family=Line+Seed+Sans+KR:wght@400;700&display=swap"
        rel="stylesheet"
      />
      <main className="flex min-h-screen bg-white max-sm:flex-col">
        <MPSidebar />
        <div className="flex flex-col flex-1">
          <MPHeader />
          <ProfileForm />
        </div>
      </main>
    </>
  );
};

export default MyPageProfilePage;
