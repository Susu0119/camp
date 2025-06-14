import React from 'react';
import { useNavigate } from 'react-router-dom';

/** Navigation 아이템 */
const NavigationItem = ({ iconComponent, src, label, isActive = false, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="flex flex-col gap-1 items-center text-xs bg-transparent border-none outline-none"
    >
      {src ? (
        <img src={src} alt={label} className="w-6 h-6" />
      ) : (
        <div className={`w-6 h-6 flex items-center justify-center ${isActive ? 'text-fuchsia-700' : 'text-black'}`}>
          {iconComponent}
        </div>
      )}
      <div className={`${isActive ? 'text-fuchsia-700 font-semibold' : 'text-black'}`}>
        {label}
      </div>
    </button>
  );
};

/** 하단 네비게이션 바 */
const NavigationBar = () => {
  const navigate = useNavigate();

  return (
    <nav
      className="navigation-bar fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white border-t border-[#e5e5e5] w-full"
      style={{ height: '68px', maxWidth: '393px' }}
    >
      <div className="flex justify-between items-center px-8 py-2.5 h-full">

        <NavigationItem
          label="나의 예약"
          src="https://storage.googleapis.com/m4gi/images/Navigation1.svg"
          onClick={() => navigate('/mypage/reservations')}
        />

        <NavigationItem
          label="검색"
          src="https://storage.googleapis.com/m4gi/images/Navigation2.svg"
          onClick={() => navigate('/search')}
        />

        <NavigationItem
          label="홈"
          src="https://storage.googleapis.com/m4gi/images/Navigation3.svg"
          isActive={true}
          onClick={() => navigate('/main')}
        />

        <NavigationItem
          label="고객센터"
          src="https://storage.googleapis.com/m4gi/images/Navigation4.svg"
          onClick={() => navigate('/cs/main')}
        />

        <NavigationItem
          label="마이페이지"
          src="https://storage.googleapis.com/m4gi/images/Navigation5.svg"
          onClick={() => navigate('/mypage/main')}
        />

      </div>
    </nav>
  );
};

export default NavigationBar;
