"use client";
import React from "react";
import { useNavigate } from "react-router-dom";

import KakaoButton from "../../Login/UI/KakaoButton";

export default function LoginForm() {
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
  };

  const handleGuestLogin = () => {
    navigate('/main');
  };

  return (
    <div className="relative w-full px-6 z-[100]">
      {/* 반딧불이 효과 */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-1 h-1 bg-yellow-300 rounded-full shadow-lg firefly-anim"
          style={{
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 6}s`,
            animationDuration: `${4 + Math.random() * 3}s`,
            boxShadow: '0 0 8px rgba(255, 221, 68, 0.3)',
            zIndex: 1
          }}
        />
      ))}

      {/* 떠다니는 파티클들 */}
      {Array.from({ length: 8 }).map((_, i) => (
        <div
          key={`particle-${i}`}
          className="absolute rounded-full opacity-30 floating-particles"
          style={{
            width: `${2 + Math.random() * 3}px`,
            height: `${2 + Math.random() * 3}px`,
            background: `linear-gradient(45deg, #ff6b6b, #4ecdc4, #45b7d1, #96ceb4)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 8}s`,
            zIndex: 2
          }}
        />
      ))}

      {/* 빛나는 오브들 */}
      {Array.from({ length: 4 }).map((_, i) => (
        <div
          key={`orb-${i}`}
          className="absolute rounded-full opacity-20 glowing-orbs"
          style={{
            width: `${20 + Math.random() * 30}px`,
            height: `${20 + Math.random() * 30}px`,
            background: `radial-gradient(circle, rgba(255,255,255,0.8) 0%, rgba(255,165,0,0.4) 50%, transparent 100%)`,
            left: `${Math.random() * 100}%`,
            top: `${Math.random() * 100}%`,
            animationDelay: `${Math.random() * 10}s`,
            filter: 'blur(1px)',
            zIndex: 1
          }}
        />
      ))}

      <div className="max-w-[420px] mx-auto relative">
        {/* 폼 주변 부드러운 효과 */}
        <div
          className="absolute inset-0 rounded-3xl opacity-10"
          style={{
            background: 'linear-gradient(45deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05))',
            filter: 'blur(10px)',
            transform: 'scale(1.02)',
            zIndex: 0
          }}
        />

        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full px-8 py-10  rounded-3xl bg-white/15 backdrop-blur-3xl border border-white/30 shadow-2xl hover:bg-white/20 transition-all duration-500 group"
          style={{
            boxShadow: `
              0 15px 25px rgba(0, 0, 0, 0.1),
              inset 0 1px 0 rgba(255, 255, 255, 0.2),
              0 0 20px rgba(255, 255, 255, 0.05)
            `,
            background: `
              linear-gradient(135deg, 
                rgba(255, 255, 255, 0.15) 0%, 
                rgba(255, 255, 255, 0.05) 50%, 
                rgba(255, 255, 255, 0.1) 100%
              )
            `
          }}
        >
          {/* 폼 내부 장식 요소들 */}
          <div className="absolute top-4 left-4 w-2 h-2 bg-white rounded-full animate-pulse opacity-20"></div>
          <div className="absolute top-6 right-6 w-1 h-1 bg-white rounded-full animate-pulse opacity-15"></div>
          <div className="absolute bottom-4 left-6 w-1.5 h-1.5 bg-white rounded-full animate-pulse opacity-25"></div>
          <div className="absolute bottom-6 right-4 w-1 h-1 bg-white rounded-full animate-pulse opacity-20"></div>

          {/* 메인 헤더 */}
          <div className="text-center mb-6">
            <div className="relative inline-block">
              <h2 className="text-2xl font-bold text-white mb-2 drop-shadow-lg group-hover:scale-105 transition-transform duration-300">
                Welcome Back
              </h2>
              <div className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-40"></div>
            </div>
          </div>

          <p className="text-center text-gray-200 mb-8 text-sm relative">
            <span className="relative z-10 bg-gradient-to-r from-gray-200 to-gray-300 bg-clip-text text-transparent">
              자연과 함께하는 특별한 순간
            </span>
          </p>

          <div className="mt-6 mb-6 relative">
            {/* 카카오 버튼 주변 부드러운 효과 */}
            <div className="absolute inset-0 bg-gradient-to-r from-white/10 to-white/5 rounded-full opacity-10 blur-md transform scale-105"></div>
            <KakaoButton variant="long" />
          </div>

          {/* 구분선 */}
          <div className="flex items-center justify-center my-6">
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
            <div className="mx-4 flex items-center gap-1">
              <span className="text-xs text-white/70">OR</span>
            </div>
            <div className="flex-1 h-px bg-gradient-to-r from-transparent via-white/30 to-transparent"></div>
          </div>

          {/* 게스트 로그인 옵션 */}
          <div className="text-center mb-6">
            <button
              type="button"
              onClick={handleGuestLogin}
              className="text-white/80 text-sm cursor-pointer hover:text-white transition-colors duration-300 underline decoration-dotted hover:decoration-solid"
            >
              게스트로 둘러보기 →
            </button>
          </div>

          {/* 로그인 폼 하단 장식 */}
          <div className="mt-8 text-center">
            <div className="flex items-center justify-center gap-3 text-gray-300 text-xs mb-4">
              <span className="bg-gradient-to-r from-gray-300 to-gray-100 bg-clip-text text-transparent">
                자연 속에서 찾는 진정한 휴식
              </span>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
