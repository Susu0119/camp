import React from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import NotificationsIcon  from '@mui/icons-material/Notifications'; 


// 알림 유형에 따라 적절한 아이콘을 반환하는 함수
const getNotificationIcon = (type) => {
    switch (type) {
        case 'reservation':
            return <EventNoteIcon fontSize="small" />;
        case 'review':
            return <ChatBubbleOutlineIcon fontSize="small" />;
        case 'welcome':
            return <SentimentSatisfiedAltIcon fontSize="small" />;
        default:
            return <NotificationsIcon fontSize="small" />; 
    }
};

export default function NotificationItem({ type, title, message, time }) {
    return (
        <div className="bg-white border-2 border-[#8C06AD] rounded-lg p-4 flex gap-4 items-start shadow-md">
            <div className="text-gray-600 mt-1">
                {getNotificationIcon(type)}
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-baseline">
                    <span className="font-bold text-base text-gray-900">{title}</span>
                    <span className="text-xs text-gray-500">{time}</span>
                </div>
                <p className="text-sm text-gray-700 mt-1">{message}</p>
            </div>
        </div>
    );
}