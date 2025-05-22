"use client";
import { UserProfile } from "./AdminUserProfile";
import { NavigationMenu } from "./AdminNav";

export function AdminSidebar() {
  return (
    <nav className="overflow-hidden pt-16 mx-auto w-full text-center text-white bg-fuchsia-950 max-md:mt-10">
      <div className="flex flex-col items-start px-5 w-full text-3xl max-md:px-5">
        <h1 className="ml-4 text-5xl max-md:ml-2.5 max-md:text-4xl">
          Campia
        </h1>
        <UserProfile />
        <hr className="shrink-0 self-stretch mt-6 ml-2.5 w-full h-px border border-white border-solid max-md:mr-2.5" />
        <NavigationMenu />
        <div className="flex gap-2.5 mt-7 whitespace-nowrap max-md:ml-2">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/026f3743b95dd21d2a5c096282ee0817ba721bd3?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
            alt="Notifications"
            className="object-contain shrink-0 my-auto aspect-[1.07] w-[30px]"
          />
          <span>알림</span>
        </div>
        <div className="flex gap-2.5 mt-5 ml-3 whitespace-nowrap max-md:ml-2.5">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/TEMP/0c98bb0f6e9f841d2a0b8163520dec923a50df0a?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
            alt="Dashboard"
            className="object-contain shrink-0 my-auto aspect-[0.96] w-[27px]"
          />
          <span>대시보드</span>
        </div>
      </div>
      <button className="flex overflow-hidden gap-2.5 px-16 py-7 mt-24 text-2xl whitespace-nowrap bg-fuchsia-950 max-md:px-5 max-md:mt-10 w-full items-center justify-center">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/TEMP/03cb90f6a78502809326f2c304c4bfaa359ada3f?placeholderIfAbsent=true&apiKey=5b078ce04b8d4ba38e042bfba22850ff"
          alt="Logout"
          className="object-contain shrink-0 self-start w-6 aspect-square"
        />
        <span>로그아웃</span>
      </button>
    </nav>
  );
}
