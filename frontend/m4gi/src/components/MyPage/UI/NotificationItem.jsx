import React from 'react';
// Material-UI Icons (설치 필요: npm install @mui/material @emotion/react @emotion/styled @mui/icons-material)
import EventNoteIcon from '@mui/icons-material/EventNote';      
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline'; 
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'; 
import NotificationsIcon from '@mui/icons-material/Notifications'; 
import InfoIcon from '@mui/icons-material/Info'; 


const getNotificationIcon = (type) => {
    switch (type) {
        case 'RESERVATION_COMPLETED': // 예약 완료
        case 'RESERVATION_CANCELLED': // 예약 취소
        case 'REMINDER_PRE_CAMP':     // 캠핑 D-3, D-1
        case 'REMINDER_CAMP_TODAY':   // 캠핑 당일
            return <EventNoteIcon fontSize="small" className="text-blue-600" />; // 예약 관련은 파란색 달력 아이콘
        case 'NOTICE': // 공지사항
            return <InfoIcon fontSize="small" className="text-yellow-600" />; // 공지사항은 정보 아이콘
        // 만약 다른 알림 유형이 있다면 여기에 추가할 수 있습니다.
        // case 'REVIEW_ALERT': // 예: 리뷰 알림
        //    return <ChatBubbleOutlineIcon fontSize="small" className="text-purple-600" />;
        // case 'WELCOME_ALERT': // 예: 환영 알림
        //    return <SentimentSatisfiedAltIcon fontSize="small" className="text-green-600" />;
        default:
            return <NotificationsIcon fontSize="small" className="text-gray-500" />; // 기본 알림 아이콘
    }
};

/**
 * 개별 알림 항목을 표시하는 컴포넌트입니다.
 *
 * @param {string} alertType - 알림의 유형 (예: 'RESERVATION_COMPLETED', 'NOTICE')
 * @param {string} displayTitle - 화면에 표시될 알림의 제목 (예: 캠핑장 이름, 공지사항 제목)
 * @param {string} displayContent - 화면에 표시될 알림의 내용
 * @param {Date} displayDate - 화면에 표시될 알림의 날짜 (Date 객체)
 */
export default function NotificationItem({ alertType, displayTitle, displayContent, displayDate }) {
    // 날짜를 "YYYY.MM.DD HH:MM" 형식으로 포맷합니다.
    const formattedTime = displayDate.toLocaleString('ko-KR', {
        year: 'numeric',
        month: '2-digit',
        day: '2-digit',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false // 24시간 형식
    });

    // 알림 유형에 따라 배경색을 약간 다르게 하여 시각적으로 구분합니다.
    const backgroundColor = alertType === 'NOTICE' ? 'bg-gray-50' : 'bg-blue-50';

    return (
        <div className={`${backgroundColor} border border-gray-200 rounded-lg p-4 flex gap-3 items-start shadow-sm transition-all duration-200 hover:shadow-md`}>
            {/* 알림 아이콘 */}
            <div className="flex-shrink-0 mt-1">
                {getNotificationIcon(alertType)}
            </div>
            {/* 알림 내용 */}
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-baseline mb-1">
                    {/* 알림 제목 (캠핑장 이름 또는 공지 제목) */}
                    <span className="font-bold text-base text-gray-900 leading-snug">{displayTitle}</span>
                    {/* 알림 시간 */}
                    <span className="text-xs text-gray-500 ml-2 whitespace-nowrap">{formattedTime}</span>
                </div>
                {/* 알림 메시지 */}
                <p className="text-sm text-gray-700 leading-relaxed">{displayContent}</p>
            </div>
        </div>
    );
}
