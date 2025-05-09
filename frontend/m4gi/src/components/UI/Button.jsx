import React from 'react'; //React 주입

// 컴포넌트 정의 (children = 텍스트 / className 초기화 / id, name과 같은 속성을 ...props로 모두 모아둠)
export function Button({ children, className = '', ...props }) {
    return (
        <button
            {...props} // 모아둔 속성을 여기에 전개
            className={ // 아래 백틱 부분에 기본 스타일 정의
                `select-none, cursor-pointer px-4 py-2 rounded-md font-medium transition ` +
                className // 기본 스타일 이외의 추가 스타일을 받아올 수 있음
            }
        >
            {children} {/* 렌더링 할 텍스트 */}
        </button>
    );
}