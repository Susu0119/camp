import React from 'react';
import { SideBarIcons } from './MP_SideBarIcons';
import { useNavigate } from 'react-router-dom';

export default function MPSidebarItem({ text, svgName, route, isCategory = false, isOperator=false }) {
    const navigate = useNavigate();
    const svg = SideBarIcons[svgName];

    const handleClick = () => {
        navigate(route);
    }
    
    if (isCategory) {
        return (
            <div className="my-2 px-4">
                <div className="flex items-center">
                    <span className="text-sm font-normal text-[#71717a]">
                        {text}
                    </span>
                </div>
            </div>
        );
    }

    // 캠핑장 관계자 혹은 관리자 관련 버튼인 경우
    if(isOperator) {
        return (
        <div
            className="flex items-center px-4 py-2.5 rounded-md cursor-pointer hover:bg-[#f4f4f5]"
            onClick={handleClick}
        >
            <div className="w-4 h-4 mr-2 mb-1">
                {svg}
            </div>
            <div className="flex items-center">
                <span className="text-sm font-bold text-cpurple">
                    {text}
                </span>
            </div>
        </div>
    );
    }

    return (
        <div
            className="flex items-center px-4 py-2.5 rounded-md cursor-pointer hover:bg-[#f4f4f5]"
            onClick={handleClick}
        >
            <div className="w-4 h-4 mr-2 mb-1">
                {svg}
            </div>
            <div className="flex items-center">
                <span className="text-sm font-bold text-black">
                    {text}
                </span>
            </div>
        </div>
    );
};