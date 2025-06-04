import React from "react";

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

export default Button;
