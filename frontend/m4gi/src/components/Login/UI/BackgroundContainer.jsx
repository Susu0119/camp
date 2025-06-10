import React, { useEffect, useRef } from "react";

const BackgroundContainer = ({ children }) => {
  const starsRef = useRef([]);

  useEffect(() => {
    // 별 생성
    const createStars = () => {
      // 기존 별들 제거
      starsRef.current.forEach(star => star.remove());
      starsRef.current = [];

      for (let i = 0; i < 200; i++) {
        const star = document.createElement('div');
        star.className = 'absolute bg-white rounded-full';
        const size = Math.random() * 3 + 1;
        const duration = Math.random() * 3 + 2;
        star.style.cssText = `
          width: ${size}px;
          height: ${size}px;
          left: ${Math.random() * 100}%;
          top: ${Math.random() * 100}%;
          opacity: ${Math.random() * 0.8 + 0.2};
          z-index: 1;
          animation: twinkle ${duration}s infinite;
          position: fixed;
        `;
        document.body.appendChild(star);
        starsRef.current.push(star);
      }
    };

    // 별똥별 생성
    const createShootingStar = () => {
      const shootingStar = document.createElement('div');
      shootingStar.style.cssText = `
        position: fixed;
        width: 2px;
        height: 2px;
        background: linear-gradient(45deg, white, transparent);
        border-radius: 50%;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 50}%;
        z-index: 1;
        animation: shooting 2s linear;
      `;

      document.body.appendChild(shootingStar);

      setTimeout(() => {
        shootingStar.remove();
      }, 2000);
    };

    // CSS 애니메이션을 헤드에 추가
    const style = document.createElement('style');
    style.textContent = `
      @keyframes twinkle {
        0%, 100% { opacity: 0.2; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.2); }
      }
      
      @keyframes shooting {
        0% { transform: translateX(0) translateY(0); opacity: 1; }
        100% { transform: translateX(300px) translateY(300px); opacity: 0; }
      }
      
      @keyframes fireFlicker {
        0%, 100% { 
          transform: scaleY(1) scaleX(1) rotate(0deg);
          filter: hue-rotate(0deg);
        }
        25% { 
          transform: scaleY(1.1) scaleX(0.95) rotate(-2deg);
          filter: hue-rotate(10deg);
        }
        50% { 
          transform: scaleY(0.95) scaleX(1.05) rotate(1deg);
          filter: hue-rotate(-5deg);
        }
        75% { 
          transform: scaleY(1.05) scaleX(0.98) rotate(-1deg);
          filter: hue-rotate(15deg);
        }
      }
      
      @keyframes emberFloat {
        0% { transform: translateY(0) translateX(0) scale(1); opacity: 0; }
        10% { opacity: 1; }
        90% { opacity: 0.3; }
        100% { transform: translateY(-120px) translateX(20px) scale(0); opacity: 0; }
      }
      
      @keyframes smokeRise {
        0% { transform: translateY(0) scale(0.5); opacity: 0.3; }
        100% { transform: translateY(-250px) scale(2); opacity: 0; }
      }
    `;
    document.head.appendChild(style);

    createStars();

    // 별똥별 주기적 생성
    const shootingStarInterval = setInterval(createShootingStar, 2000);

    return () => {
      // 정리 작업
      clearInterval(shootingStarInterval);
      starsRef.current.forEach(star => star.remove());
      document.head.removeChild(style);
    };
  }, []);

  return (
    <main
      className="min-h-screen w-full overflow-y-auto overflow-x-hidden"
      style={{
        background: `
          linear-gradient(45deg, #0a0a2e 0%, #16213e 30%, #0f3460 70%, #0a0a2e 100%),
          radial-gradient(circle at 20% 80%, rgba(120, 80, 150, 0.3) 0%, transparent 50%),
          radial-gradient(circle at 80% 20%, rgba(80, 120, 200, 0.3) 0%, transparent 50%)
        `,
        backgroundAttachment: 'fixed'
      }}
    >
      {/* 산맥 실루엣 */}
      <div
        className="fixed bottom-0 left-0 w-full h-1/3 z-10"
        style={{
          background: `linear-gradient(to top, 
            rgba(10, 10, 46, 0.9) 0%, 
            rgba(10, 10, 46, 0.7) 50%, 
            transparent 100%
          )`,
          clipPath: 'polygon(0 100%, 0 60%, 15% 45%, 30% 55%, 45% 40%, 60% 50%, 75% 35%, 90% 45%, 100% 40%, 100% 100%)'
        }}
      />

      {/* 모닥불 컨테이너 */}
      <div className="fixed bottom-20 left-20 z-20">
        <div className="fire-container relative w-36 h-48">
          {/* 장작 */}
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-16 h-4 bg-gradient-to-r from-amber-900 to-amber-700 rounded-full" />
          <div className="absolute bottom-1 left-1/2 transform -translate-x-1/2 rotate-45 w-12 h-3 bg-gradient-to-r from-amber-800 to-amber-600 rounded-full" />

          {/* 불꽃들 */}
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-15 h-20"
            style={{
              background: 'radial-gradient(circle at 50% 100%, #ff4500 0%, #ff6b00 30%, #ffaa00 60%, #ff0000 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: 'fireFlicker 0.8s infinite alternate'
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-10 h-15"
            style={{
              background: 'radial-gradient(circle at 50% 100%, #ff4500 0%, #ff6b00 30%, #ffaa00 60%, #ff0000 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: 'fireFlicker 1.2s infinite alternate',
              animationDelay: '0.2s'
            }}
          />
          <div
            className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-6 h-10"
            style={{
              background: 'radial-gradient(circle at 50% 100%, #ff4500 0%, #ff6b00 30%, #ffaa00 60%, #ff0000 100%)',
              borderRadius: '50% 50% 50% 50% / 60% 60% 40% 40%',
              animation: 'fireFlicker 0.6s infinite alternate',
              animationDelay: '0.4s'
            }}
          />

          {/* 불똥들 */}
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-orange-400 rounded-full"
              style={{
                left: `${50 + Math.random() * 20 - 10}%`,
                bottom: '60px',
                animation: `emberFloat ${2 + Math.random() * 2}s infinite`,
                animationDelay: `${Math.random() * 3}s`
              }}
            />
          ))}

          {/* 연기 */}
          {Array.from({ length: 5 }).map((_, i) => (
            <div
              key={i}
              className="absolute w-5 h-5 bg-gray-200/30 rounded-full"
              style={{
                left: `${40 + i * 5}%`,
                bottom: '80px',
                animation: `smokeRise 4s infinite`,
                animationDelay: `${i * 1}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* 달 */}
      <div
        className="fixed top-20 right-20 w-20 h-20 rounded-full z-10"
        style={{
          background: 'radial-gradient(circle at 30% 30%, #ffffff 0%, #f0f0f0 40%, #e0e0e0 100%)',
          boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)'
        }}
      >
        {/* 달 크레이터 */}
        <div className="absolute top-3 left-4 w-2 h-2 bg-gray-300 rounded-full opacity-50" />
        <div className="absolute top-8 left-2 w-1 h-1 bg-gray-400 rounded-full opacity-30" />
        <div className="absolute bottom-4 right-3 w-1.5 h-1.5 bg-gray-300 rounded-full opacity-40" />
      </div>

      {/* 안개 효과 */}
      <div
        className="fixed bottom-0 left-0 w-full h-1/4 z-5"
        style={{
          background: 'linear-gradient(to top, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 50%, transparent 100%)',
          animation: 'smokeRise 30s infinite'
        }}
      />

      {/* 실제 콘텐츠 영역 */}
      <div className="relative">
        {children}
      </div>
    </main>
  );
};

export default BackgroundContainer;
