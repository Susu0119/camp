import React from 'react';
import EventNoteIcon from '@mui/icons-material/EventNote';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt';
import NotificationsIcon from '@mui/icons-material/Notifications'; 


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
    // 백엔드에서 받은 title과 message를 합쳐서 표시할 최종 메시지를 생성합니다.
    let displayContent = message; 
    
    // 이 로직은 `NotificationModal`의 `formatNoticeContent`가 최종 메시지를 생성하므로
    // 실제로는 많이 변경되지 않을 수 있지만, 다른 알림 타입에서 독립적인 title과 message가 올 경우를 대비합니다.
    if (title && !message.startsWith(`'${title}'`)) {
        displayContent = `${title} ${message}`;
    } else if (title && !message) { // message가 없고 title만 있는 경우
        displayContent = title;
    }


    return (
        <div className="bg-white border-2 border-[#8C06AD] rounded-lg p-4 flex gap-4 items-start shadow-md">
            <div className="text-gray-600 mt-1">
                {getNotificationIcon(type)}
            </div>
            <div className="flex flex-col flex-1">
                <div className="flex justify-between items-baseline w-full">
                    {/* displayContent와 time을 한 줄에 배치 */}
                    {/* dangerouslySetInnerHTML을 사용하여 HTML 문자열을 렌더링합니다. */}
                    <span 
                        className="text-sm font-bold text-gray-900 flex-grow pr-2 break-words"
                        dangerouslySetInnerHTML={{ __html: displayContent }} // <-- 이 줄이 수정되었습니다!
                    />
                    <span className="text-xs text-gray-500 flex-shrink-0">{time}</span>
                </div>
            </div>
        </div>
    );
}