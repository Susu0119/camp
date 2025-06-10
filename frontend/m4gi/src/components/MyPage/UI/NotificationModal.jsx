import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import axios from 'axios';

const getTypeFromTitle = (title) => {
    if (title.includes('예약')) return 'reservation';
    if (title.includes('리뷰') || title.includes('후기')) return 'review';
    if (title.includes('환영')) return 'welcome';
    return 'default';
};
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};

export default function NotificationModal() {
    const [notifications, setNotifications] = useState({ today: [], previous: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            try {
                const response = await axios.get('/api/notices/my-notices');

                const data = response.data;

                const today = new Date().toISOString().split('T')[0];
                const todayNotices = [];
                const previousNotices = [];

                data.forEach(notice => {
                    const formattedNotice = {
                        id: notice.notice_id,
                        type: getTypeFromTitle(notice.notice_title),
                        title: notice.notice_title,
                        message: notice.notice_content,
                        time: notice.created_at,
                    };

                    if (notice.created_at.startsWith(today)) {
                        formattedNotice.time = new Date(notice.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                        todayNotices.push(formattedNotice);
                    } else {
                        formattedNotice.time = formatDate(notice.created_at);
                        previousNotices.push(formattedNotice);
                    }
                });

                todayNotices.sort((a, b) => new Date(b.time) - new Date(a.time));
                previousNotices.sort((a, b) => new Date(b.time) - new Date(a.time));

                setNotifications({ today: todayNotices, previous: previousNotices });

            } catch (err) {
                if (err.response && err.response.status === 401) {
                    setError('로그인이 필요합니다.');
                } else {
                    setError('알림을 불러오는 데 실패했습니다.');
                }
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        };

        fetchNotices();
    }, []);

    if (isLoading) {
        return (
            <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-5 text-center">
                <p className="text-gray-600">알림을 불러오는 중입니다...</p>
            </div>
        );
    }
    
    if (error) {
         return (
            <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-5 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    if (notifications.today.length === 0 && notifications.previous.length === 0) {
        return (
            <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-10 text-center">
                <p className="text-lg text-gray-500">알림 내역이 없습니다.</p>
            </div>
        );
    }

    return (
        <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 overflow-hidden">
            {notifications.today.length > 0 && (
                <div className="p-5">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">오늘 받은 알림</h3>
                    <div className="flex flex-col gap-3">
                        {notifications.today.map(item => (
                            <NotificationItem key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            )}
            {notifications.previous.length > 0 && (
                 <div className="p-5 border-t border-gray-200">
                    <h3 className="text-lg font-bold text-gray-800 mb-4">이전 알림</h3>
                    <div className="flex flex-col gap-3">
                        {notifications.previous.map(item => (
                            <NotificationItem key={item.id} {...item} />
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}