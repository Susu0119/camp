import React from "react";

export default function Loading() {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-white">
        <div className="loading flex scale-200 items-center justify-center">
      <svg height={0} width={0} viewBox="0 0 64 64" className="absolute">
        <defs>
          <linearGradient gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="b">
            <stop stopColor="#973BED" />
            <stop stopColor="#007CFF" offset={1} />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" y2={0} x2={0} y1={64} x1={0} id="c">
            <stop stopColor="#FFC800" />
            <stop stopColor="#F0F" offset={1} />
            <animateTransform
              repeatCount="indefinite"
              keySplines=".42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1;.42,0,.58,1"
              keyTimes="0; 0.125; 0.25; 0.375; 0.5; 0.625; 0.75; 0.875; 1"
              dur="8s"
              values="0 32 32;-270 32 32;-270 32 32;-540 32 32;-540 32 32;-810 32 32;-810 32 32;-1080 32 32;-1080 32 32"
              type="rotate"
              attributeName="gradientTransform"
            />
          </linearGradient>
          <linearGradient gradientUnits="userSpaceOnUse" y2={2} x2={0} y1={62} x1={0} id="d">
            <stop stopColor="#00E0ED" />
            <stop stopColor="#00DA72" offset={1} />
          </linearGradient>
        </defs>
      </svg>
      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 48 64" height="64" width="64" class="inline-block">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#b)" d="M 50 50 A 24 24 0 1 1 50 14" class="dash" pathLength="360"></path>
      </svg>
      <div class="w-2"></div>
      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 60 64" height="64" width="64" class="inline-block">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#c)" d="M 12 54 L 32 10 L 52 54 M 20 40 H 44" class="dash" pathLength="360"></path>
      </svg>
      <div class="w-2"></div>
      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 64 64" height="64" width="64" class="inline-block">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#d)" d="M 10 54 V 10 L 32 32 L 54 10 V 54" class="dash" pathLength="360"></path>
      </svg>
      <div class="w-2"></div>
      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="0 0 64 64" height="64" width="64" class="inline-block">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#b)" d="M 12 54 V 10 H 32 a 14 14 0 1 1 0 28 H 12" class="dash" pathLength="360"></path>
      </svg>
      <div class="w-2"></div>
      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="25 0 20 64" height="64" width="20" class="inline-block">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#c)" d="M 32 10 V 54" class="dash" pathLength="360"></path>
      </svg>
      <div class="w-2"></div>
      <svg xmlns="[http://www.w3.org/2000/svg](http://www.w3.org/2000/svg)" fill="none" viewBox="5 0 64 64" height="64" width="64" class="inline-block">
        <path stroke-linejoin="round" stroke-linecap="round" stroke-width="8" stroke="url(#d)" d="M 12 54 L 32 10 L 52 54 M 20 40 H 44" class="dash" pathLength="360"></path>
      </svg>
      </div>
    </div>
  );
};