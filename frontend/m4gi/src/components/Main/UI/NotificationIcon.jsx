// src/components/Icons/NotificationIcon.jsx
import React from "react";

export function NotificationIcon({ className = "w-6 h-6", strokeWidth = 1.5 }) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="black"   
      strokeWidth={strokeWidth}  
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden="true"
      focusable="false"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6 6 0 10-12 0v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9"
      />
    </svg>
  );
}
