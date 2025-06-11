import React from "react";

const NavItem = ({ icon, label }) => {
  const renderIcon = () => {
    switch (icon) {
      case "home":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nav-icon"
            style={{ width: "16px", height: "16px" }}
          >
            <path
              d="M2 5.99967L8 1.33301L14 5.99967V13.333C14 13.6866 13.8595 14.0258 13.6095 14.2758C13.3594 14.5259 13.0203 14.6663 12.6667 14.6663H3.33333C2.97971 14.6663 2.64057 14.5259 2.39052 14.2758C2.14048 14.0258 2 13.6866 2 13.333V5.99967Z"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M6 14.6667V8H10V14.6667"
              stroke="black"
              strokeWidth="1.33333"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        );
      case "account":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nav-icon"
            style={{ width: "16px", height: "16px" }}
          >
            <path
              d="M3.89992 11.3997C4.46659 10.9663 5.09992 10.6247 5.79992 10.3747C6.49992 10.1247 7.23325 9.99967 7.99992 9.99967C8.76659 9.99967 9.49992 10.1247 10.1999 10.3747C10.8999 10.6247 11.5333 10.9663 12.0999 11.3997..."
              fill="#1D1B20"
            />
          </svg>
        );
      case "close":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nav-icon"
            style={{ width: "16px", height: "16px" }}
          >
            <path
              d="M4.26659 12.6663L3.33325 11.733L7.06659 7.99967L3.33325 4.26634L4.26659 3.33301L7.99992 7.06634L11.7333 3.33301L12.6666 4.26634L8.93325 7.99967L12.6666 11.733L11.7333 12.6663L7.99992 8.93301L4.26659 12.6663Z"
              fill="#1D1B20"
            />
          </svg>
        );
      case "calendar":
        return (
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            className="nav-icon"
            style={{ width: "16px", height: "16px" }}
          >
            <path
              d="M6 10.9997C5.53333 10.9997 5.13889 10.8386 4.81667 10.5163..."
              fill="#1D1B20"
            />
          </svg>
        );
      // 필요에 따라 다른 아이콘들도 추가
      default:
        return null;
    }
  };

  return (
    <div className="nav-item">
      {renderIcon()}
      <span className="nav-label">{label}</span>
    </div>
  );
};

export default NavItem;
