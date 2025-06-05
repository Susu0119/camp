import React, { useState, useEffect, useRef } from 'react';

export default function LazyImage ({ src, alt, className }) {
  const [isVisible, setIsVisible] = useState(false);
  const imgRef = useRef(null);
  
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry], obs) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          obs.disconnect();   // 한 번 로드하면 관찰 해제
        }
      },
      { threshold: 0.1 }      // 10% 보이면 로딩
    );
    if (imgRef.current) {
      observer.observe(imgRef.current);
    }
    return () => observer.disconnect();
  }, []);

  // 이미지 url이 없는 경우
  if (!src) {
    return (
      <div 
        rev={imgRef} 
        className={`no-image absolute top-0 left-0 w-full h-full flex items-center justify-center bg-gray-100 ${className}`}
      >
      </div>
    );
  }

  return (
    <img
      ref={imgRef}
      src={isVisible ? src : undefined}         // 보일 때만 src 설정
      alt={alt}
      className={className}
      loading="lazy"                            // 브라우저 기본 lazy 로딩
    />
  );
}
