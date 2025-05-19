import React from "react";

export default function MainHeader() {
  return (
    <header className="flex justify-between items-center px-6 py-4 w-full bg-white shadow-[0px_2px_4px_rgba(0,0,0,0.1)] h-[100px]">
      {/* 왼쪽: 로고 + 텍스트 */}
      <div className="flex gap-2.5 items-center font-['Gapyeong_Wave'] text-4xl text-fuchsia-700 select-none">
        <img
          src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ac1e1903cdffe41cf50fd0a5d741c49309973b46?placeholderIfAbsent=true"
          alt="Campia Logo"
          className="w-[59px] aspect-[1.09] object-contain"
        />
        <h1>Campia</h1>
      </div>

      <div className="main-header-right flex gap-5 items-center">
      {/* 오른쪽: 알림 + 프로필 */}
      <div className="flex gap-5 items-center">
        <button className="flex items-center justify-center p-3 bg-[#EDDDF4] bg-opacity-10 rounded-full w-[47px] h-[47px]">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/47f02f1ff6983d29a5eea4cf884c454f54375d52?placeholderIfAbsent=true"
            alt="Notification"
            className="w-[17px] object-contain"
          />
        </button>
        <div className="flex gap-4 items-center px-4 py-2 bg-gray-200 rounded-full">
          <img
            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/b1024f687032e52ece02b8a056563b85dc471ea7?placeholderIfAbsent=true"
            alt="Menu"
            className="w-[22px] object-contain"
          />
          <img
            src="https://cdn.builder.io/api/v1/image/assets/2e85db91f5bc4c1490f4944382f6bff3/ead1847b3130b18aa9d45c1baaf72dc4f26b1228?placeholderIfAbsent=true"
            alt="Profile"
            className="w-[35px] aspect-square object-contain"
          />
        </div>
      </div>
      </div>  
    </header>
  );
}
