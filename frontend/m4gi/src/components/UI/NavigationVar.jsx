import React from 'react';

const NavigationItem = ({ icon, label, isActive = false }) => {
  return (
    <div className="flex flex-col gap-1 items-center text-xs">
      <div
        className={`w-6 h-6 ${
          isActive ? 'text-fuchsia-700' : 'text-black'
        }`}
        dangerouslySetInnerHTML={{ __html: icon }}
      />
      <div className={`${isActive ? 'text-fuchsia-700 font-semibold' : 'text-black'}`}>
        {label}
      </div>
    </div>
  );
};

const NavigationVar = () => {
  return (
    <nav
      className="navigation-var fixed bottom-0 left-1/2 transform -translate-x-1/2 bg-white shadow-sm w-full"
      style={{ height: '68px', maxWidth: '393px' }}
    >
      <div className="flex justify-between items-center px-8 py-2.5 h-full">
        <NavigationItem
          icon="<svg id=&quot;I246:3130;120:2567&quot; layer-name=&quot;reservation_svg&quot; width=&quot;25&quot; height=&quot;24&quot; viewBox=&quot;0 0 25 24&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; class=&quot;w-[24px] h-[24px]&quot;> <path d=&quot;M7.0501 2.99402V5.24402M17.5501 2.99402V5.24402M3.2981 18.744V7.49102C3.2981 6.89428 3.53515 6.32199 3.95711 5.90003C4.37906 5.47807 4.95136 5.24102 5.5481 5.24102H19.0481C19.6448 5.24102 20.2171 5.47807 20.6391 5.90003C21.061 6.32199 21.2981 6.89428 21.2981 7.49102V18.742M21.2981 18.742C21.2981 19.3388 21.061 19.9111 20.6391 20.333C20.2171 20.755 19.6448 20.992 19.0481 20.992H5.5481C4.95136 20.992 4.37906 20.755 3.95711 20.333C3.53515 19.9111 3.2981 19.3388 3.2981 18.742V11.242C3.2981 10.6453 3.53515 10.073 3.95711 9.65103C4.37906 9.22907 4.95136 8.99202 5.5481 8.99202H19.0481C19.6448 8.99202 20.2171 9.22907 20.6391 9.65103C21.061 10.073 21.2981 10.6453 21.2981 11.242V18.742ZM14.5481 12.742H16.7981M7.7981 14.992H12.2981M12.3001 12.742H12.3051V12.748H12.3001V12.742ZM12.2991 17.242H12.3051V17.248H12.2991V17.242ZM10.0491 17.243H10.0541V17.249H10.0501V17.243H10.0491ZM7.7991 17.243H7.8041V17.248H7.7981V17.243H7.7991ZM14.5491 14.996H14.5541V15.001H14.5491V14.996ZM14.5491 17.243H14.5551V17.249H14.5491V17.243ZM16.7991 14.995H16.8051V15H16.8001L16.7991 14.995Z&quot; stroke=&quot;black&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;></path> </svg>"
          label="나의 예약"
        />

        <NavigationItem
          icon="<svg id=&quot;I246:3130;120:2571&quot; layer-name=&quot;Frame&quot; width=&quot;25&quot; height=&quot;24&quot; viewBox=&quot;0 0 25 24&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; class=&quot;w-[24px] h-[24px]&quot;> <path d=&quot;M20.9 20L16.2807 15.3806M16.2807 15.3806C17.5309 14.1304 18.2333 12.4347 18.2333 10.6666C18.2333 8.89853 17.5309 7.20285 16.2807 5.95261C15.0304 4.70237 13.3348 4 11.5667 4C9.79855 4 8.10287 4.70237 6.85263 5.95261C5.6024 7.20285 4.90002 8.89853 4.90002 10.6666C4.90002 12.4347 5.6024 14.1304 6.85263 15.3806C8.10287 16.6309 9.79855 17.3333 11.5667 17.3333C13.3348 17.3333 15.0304 16.6309 16.2807 15.3806Z&quot; stroke=&quot;black&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;></path> </svg>"
          label="검색"
        />

        <NavigationItem
          icon="<svg id=&quot;I246:3130;120:2575&quot; layer-name=&quot;Frame&quot; width=&quot;25&quot; height=&quot;24&quot; viewBox=&quot;0 0 25 24&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; class=&quot;w-[24px] h-[24px]&quot;> <path d=&quot;M2.75 11.9999L11.704 3.04495C12.144 2.60595 12.856 2.60595 13.295 3.04495L22.25 11.9999M5 9.74995V19.8749C5 20.4959 5.504 20.9999 6.125 20.9999H10.25V16.1249C10.25 15.5039 10.754 14.9999 11.375 14.9999H13.625C14.246 14.9999 14.75 15.5039 14.75 16.1249V20.9999H18.875C19.496 20.9999 20 20.4959 20 19.8749V9.74995M8.75 20.9999H17&quot; stroke=&quot;#8C06AD&quot; stroke-width=&quot;1.5&quot; stroke-linecap=&quot;round&quot; stroke-linejoin=&quot;round&quot;></path> </svg>"
          label="홈"
          isActive={true}
        />

        <NavigationItem
          icon="<svg id=&quot;I246:3130;120:2579&quot; layer-name=&quot;headphone_svg&quot; width=&quot;25&quot; height=&quot;24&quot; viewBox=&quot;0 0 25 24&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; class=&quot;w-[24px] h-[24px]&quot;> <path fill-rule=&quot;evenodd&quot; clip-rule=&quot;evenodd&quot; d=&quot;M6.69995 17.5714V18.7857C6.69995 19.1078 6.83692 19.4166 7.08071 19.6443C7.32451 19.8721 7.65517 20 7.99995 20H18.4C18.7447 20 19.0754 19.8721 19.3192 19.6443C19.563 19.4166 19.7 19.1078 19.7 18.7857V17.5714C19.7 16.6053 19.2891 15.6787 18.5577 14.9955C17.8263 14.3124 16.8343 13.9286 15.8 13.9286H10.6C9.56561 13.9286 8.57363 14.3124 7.84223 14.9955C7.11084 15.6787 6.69995 16.6053 6.69995 17.5714ZM17.1 6.64286C17.1 7.609 16.6891 8.53558 15.9577 9.21875C15.2263 9.90191 14.2343 10.2857 13.2 10.2857C12.1656 10.2857 11.1736 9.90191 10.4422 9.21875C9.71084 8.53558 9.29995 7.609 9.29995 6.64286C9.29995 5.67671 9.71084 4.75014 10.4422 4.06697C11.1736 3.3838 12.1656 3 13.2 3C14.2343 3 15.2263 3.3838 15.9577 4.06697C16.6891 4.75014 17.1 5.67671 17.1 6.64286Z&quot; stroke=&quot;black&quot; stroke-width=&quot;1.5&quot;></path> </svg>"
          label="고객센터"
        />

        <NavigationItem
          icon="<svg id=&quot;I246:3130;120:2583&quot; layer-name=&quot;Frame&quot; width=&quot;25&quot; height=&quot;24&quot; viewBox=&quot;0 0 25 24&quot; fill=&quot;none&quot; xmlns=&quot;http://www.w3.org/2000/svg&quot; class=&quot;w-[24px] h-[24px]&quot;> <path d=&quot;M6.69995 17.5714V18.7857C6.69995 19.1078 6.83692 19.4166 7.08071 19.6443C7.32451 19.8721 7.65517 20 7.99995 20H18.4C18.7447 20 19.0754 19.8721 19.3192 19.6443C19.563 19.4166 19.7 19.1078 19.7 18.7857V17.5714C19.7 16.6053 19.2891 15.6787 18.5577 14.9955C17.8263 14.3124 16.8343 13.9286 15.8 13.9286H10.6C9.56561 13.9286 8.57363 14.3124 7.84223 14.9955C7.11084 15.6787 6.69995 16.6053 6.69995 17.5714ZM17.1 6.64286C17.1 7.609 16.6891 8.53558 15.9577 9.21875C15.2263 9.90191 14.2343 10.2857 13.2 10.2857C12.1656 10.2857 11.1736 9.90191 10.4422 9.21875C9.71084 8.53558 9.29995 7.609 9.29995 6.64286C9.29995 5.67671 9.71084 4.75014 10.4422 4.06697C11.1736 3.3838 12.1656 3 13.2 3C14.2343 3 15.2263 3.3838 15.9577 4.06697C16.6891 4.75014 17.1 5.67671 17.1 6.64286Z&quot; stroke=&quot;black&quot; stroke-width=&quot;1.5&quot;></path> </svg>"
          label="마이페이지"
        />
      </div>
    </nav>
  );
};

export default NavigationVar;
