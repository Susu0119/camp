import React from "react";

// 랜덤 색상 목록
const fallbackColors = ['#FF5733', '#3498DB', '#2ECC71', '#9B59B6', '#F39C12'];

// 닉네임 기반으로 색상 고정 (랜덤 + 재사용성을 위해 해시처럼 처리)
function getColorFromNickname(nickname) {
  let hash = 0;
  for (let i = 0; i < nickname.length; i++) {
    hash = nickname.charCodeAt(i) + ((hash << 5) - hash);
  }
  const index = Math.abs(hash) % fallbackColors.length;
  return fallbackColors[index];
}

export function WelcomeSection({ nickname, profileImage }) {
  const fallbackColor = getColorFromNickname(nickname || "");

  const isProfileImageValid =
    profileImage && profileImage !== "" && profileImage.toLowerCase() !== "null";

  return (
    <section
      className="flex flex-col gap-5 items-center justify-start min-h-screen pt-20 p-10"
    >
      <h1 className="text-3xl font-bold text-black max-sm:text-3xl">
        환영합니다🤗
      </h1>

      <div className="overflow-hidden shadow-sm h-[170px] w-[170px] max-sm:h-[140px] max-sm:w-[140px] rounded-full flex items-center justify-center">
        {isProfileImageValid ? (
          <img
            src={profileImage}
            className="object-cover w-full h-full rounded-full"
            alt="Profile"
          />
        ) : (
          <div
            className="w-full h-full rounded-full flex items-center justify-center text-white text-5xl font-semibold"
            style={{ backgroundColor: fallbackColor }}
          >
            {nickname?.charAt(0).toUpperCase() || "?"}
          </div>
        )}
      </div>

      <h2 className="text-2xl text-black max-sm:text-2xl">{nickname} 님</h2>

      <p
        className="p-2.5 text-xl text-center text-black rounded-md border border-solid shadow-sm border-neutral-200 leading-[50px] w-[800px] max-md:text-2xl max-md:leading-10 max-md:w-[90%] max-sm:text-xl max-sm:leading-8"
        style={{ fontWeight: "200" }}
      >
        마이페이지에 오신 걸 환영합니다! <br />
        오늘도 캠핑 준비를 완벽하게 도와드릴게요. <br />
        마이페이지에서 캠핑 준비부터 리뷰 작성까지 손쉽게 관리하세요. <br />
        지금부터 왼쪽 사이드바에서 원하는 기능을 선택해 이용해보세요!
      </p>
    </section>
  );
}
