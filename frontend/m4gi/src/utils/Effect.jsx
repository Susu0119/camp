import * as React from 'react';
import { createPortal } from 'react-dom';
import Alert from '@mui/material/Alert';

export default function Effect({ severity = "success", children, onClose }) {
  const timeoutIds = React.useRef([]);

  // 컴포넌트 언마운트 시 모든 타이머 정리
  React.useEffect(() => {
    return () => {
      timeoutIds.current.forEach(id => clearTimeout(id));
      timeoutIds.current = [];
    };
  }, []);

  // 10x10 = 100조각 생성
  const fragments = Array.from({ length: 100 }, (_, index) => {
    const row = Math.floor(index / 10); // 0-9 (10행)
    const col = index % 10; // 0-9 (10열)
    const delay = Math.random() * 2500; // 0~1초 랜덤 딜레이
    
    // 각 조각의 clipPath 계산 (가로 10%, 세로 10% 단위)
    const clipPath = `polygon(
      ${col * 10}% ${row * 10}%, 
      ${(col + 1) * 10}% ${row * 10}%, 
      ${(col + 1) * 10}% ${(row + 1) * 10}%, 
      ${col * 10}% ${(row + 1) * 10}%
    )`;

    return (
      <Alert 
        key={index}
        className='absolute inset-0 fragment-appear'
        severity={severity} 
        onClose={() => {
          // Alert 닫을 때 모든 타이머 정리
          timeoutIds.current.forEach(id => clearTimeout(id));
          timeoutIds.current = [];
          if (onClose) onClose();
        }}
        style={{
          clipPath: clipPath,
          animationDelay: `${delay}ms`,
          animationDuration: '250ms'
        }}
      >
        {children}
      </Alert>
    );
  });

  const alert = (
    <div className="alert-bounce fixed bottom-8 right-8 w-[600px] h-[50px] z-50">
      {fragments}
    </div>
  );

  return createPortal(alert, document.body);
}