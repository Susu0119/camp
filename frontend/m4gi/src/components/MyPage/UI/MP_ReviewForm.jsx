"use client";
import React from "react";
import MPSidebar from "./MP_SideBar";
import MPHeader from "./MP_Header";

import ReviewFormContent from "./MP_ReveiwFormContent";

const ReviewForm = () => {
  return (
    <main className="relative bg-white h-[1024px] w-[1440px] max-md:w-full max-md:max-w-screen-lg">
      <MPHeader />
      <section className="flex absolute left-0 w-full h-[919px] top-[105px] max-md:flex-col">
        <MPSidebar />
        <ReviewFormContent />
      </section>
    </main>
  );
};

export default ReviewForm;
