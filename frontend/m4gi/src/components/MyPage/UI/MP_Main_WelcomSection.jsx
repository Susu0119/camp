import React from "react";

// props로 nickname과 profileImage를 받음
export function WelcomeSection({ nickname, profileImage }) {
  return (
    <section className="flex flex-col flex-1 gap-5 items-center p-10">
      <h1 className="text-4xl font-bold text-black max-sm:text-3xl">
        환영합니다
      </h1>
      <div className="overflow-hidden shadow-sm h-[170px] rounded-[90px] w-[170px] max-sm:h-[140px] max-sm:w-[140px]">
        <img
          src={profileImage}
          className="object-cover w-full h-full"
          alt="Profile"
        />
      </div>
      <h2 className="text-3xl text-black max-sm:text-2xl">
        {nickname} 님
      </h2>
      <p className="p-2.5 text-2xl text-center text-black rounded-md border border-solid shadow-sm border-neutral-200 leading-[50px] w-[800px] max-md:text-2xl max-md:leading-10 max-md:w-[90%] max-sm:text-xl max-sm:leading-8"
         style={{fontWeight:"200"}}>
        마이페이지에 오신 걸 환영합니다! <br />
        오늘도 캠핑 준비를 완벽하게 도와드릴게요. <br />
        마이페이지에서 캠핑 준비부터 리뷰 작성까지 손쉽게 관리하세요.<br />
        지금부터 왼쪽 사이드바에서 원하는 기능을 선택해 이용해보세요!
      </p>
    </section>
  );
}
