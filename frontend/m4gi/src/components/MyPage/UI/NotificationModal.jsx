import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import axios from 'axios';
import { useAuth } from '../../../utils/Auth';

// 알림 제목에 따라 타입을 결정하는 유틸리티 함수
const getTypeFromTitle = (title) => {
    if (!title || typeof title !== 'string') {
        return 'default';
    }

    if (title.includes('예약')) return 'reservation';
    if (title.includes('리뷰') || title.includes('후기')) return 'review';
    if (title.includes('환영')) return 'welcome';

    return 'default';
};

// 날짜 문자열을 "YYYY.MM.DD" 형식으로 포맷하는 유틸리티 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) { 
        return '날짜 오류';
    }
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};

// 이 함수는 'NoticeDTO'의 'noticeContent'가 특정 포맷을 가질 때만 유효하며,
// 'ReservationAlertDTO'의 'alertContent'에는 적용되지 않습니다.
const formatNoticeContent = (content) => {
    if (!content || typeof content !== 'string') {
        return content;
    }

    let campingSpotName = '';
    let processedContent = content;

    const nameExtractionRegex = /'([^']+)'\s*예약/;
    const nameMatch = processedContent.match(nameExtractionRegex);

    if (nameMatch && nameMatch[1]) {
        campingSpotName = nameMatch[1];
        processedContent = processedContent.replace(nameExtractionRegex, ' '); 
    }

    const reservationIdRegex = /\s*\(예약번호: [a-zA.Z0.9]+\)/;
    processedContent = processedContent.replace(reservationIdRegex, '');

    if (campingSpotName) {
        if (content.includes('성공적으로 완료되었습니다. 즐거운 캠핑 되세요!')) {
            return `'${campingSpotName}' 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!`.trim();
        } 
        else if (content.includes('취소되었습니다.')) {
            return `'${campingSpotName}' 예약이 취소되었습니다. 궁금한 점은 고객센터로 문의해주세요.`.trim();
        }
        else {
             return processedContent.trim();
        }
    } else {
        return processedContent.trim();
    }
};


export default function NotificationModal() {
    const [notifications, setNotifications] = useState({ today: [], previous: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    //  AuthContext에서 user 정보 가져오기 
    const { user, isAuthenticated, isLoading: isLoadingAuth } = useAuth(); // AuthProvider의 isLoading과 충돌 방지

    useEffect(() => {
        const fetchAllNotifications = async () => {
            //  인증 로딩 중이거나 인증되지 않았다면 API 호출을 대기하거나 중단 
            if (isLoadingAuth) {
                setIsLoading(true); // 알림 로딩 상태 유지
                return; // 인증 상태가 아직 결정되지 않았으므로 대기
            }

            // isAuthenticated가 false이거나 user 객체가 없다면
            // 알림을 가져올 수 없으므로 에러 처리 및 함수 종료
            if (!isAuthenticated || !user || !user.providerCode || !user.providerUserId) {
                setError('로그인이 필요하거나 사용자 정보를 찾을 수 없습니다.');
                setIsLoading(false);
                setNotifications({ today: [], previous: [] }); // 알림 비움
                return;
            }

            setIsLoading(true);
            setError(null);

            const { providerCode, providerUserId } = user; // user 객체에서 정보 추출

            try {
                const commonAxiosConfig = {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 300 || status === 304;
                    },
                };

                // 1. 일반 공지사항 API 호출 URL: /web/api/notices/user/alerts
                const noticePromise = axios.get('/api/notices/user/alerts', commonAxiosConfig);

                // 2. 예약 알림 API 호출 URL: /web/api/reservation-alerts/user/{providerCode}/{providerUserId}
                const reservationAlertPromise = axios.get(
                    `/api/reservation-alerts/user/${providerCode}/${providerUserId}`, // Context에서 가져온 정보 사용
                    commonAxiosConfig
                ); 

                const [noticeResponse, reservationAlertResponse] = await axios.all([
                    noticePromise,
                    reservationAlertPromise
                ]);
                
                // --- 디버깅을 위한 콘솔 로그 시작 ---
                console.log("--- API 응답 디버그 정보 ---");
                console.log("Notice API Response (Status:", noticeResponse.status, ") Data:", noticeResponse.data);
                console.log("Reservation Alert API Response (Status:", reservationAlertResponse.status, ") Data:", reservationAlertResponse.data);
                console.log("----------------------------");
                // --- 디버깅을 위한 콘솔 로그 끝 ---

                let combinedData = [];

                // 일반 공지사항 처리
                if (Array.isArray(noticeResponse.data)) {
                    const filteredNotices = noticeResponse.data.map(notice => ({
                        id: notice.noticeId, 
                        type: getTypeFromTitle(notice.noticeTitle),
                        title: notice.noticeTitle,
                        message: formatNoticeContent(notice.noticeContent),
                        createdAt: notice.createdAt 
                    }));
                    combinedData.push(...filteredNotices);
                } else if (noticeResponse.status === 401) { 
                    console.warn("일반 공지사항: 로그인이 필요하거나 세션이 만료되었습니다. 데이터를 처리하지 않습니다.");
                }
                else if (noticeResponse.status !== 304) {
                     console.warn("일반 공지사항 데이터가 배열이 아니거나 304가 아닙니다 (예상치 못한 응답 형식):", noticeResponse.data);
                }

                // 예약 알림 처리
                if (Array.isArray(reservationAlertResponse.data)) {
                    const filteredReservationAlerts = reservationAlertResponse.data.map(alert => ({
                        id: alert.alertId, 
                        type: 'reservation', 
                        title: alert.alertTitle,
                        message: alert.alertContent, 
                        createdAt: alert.createdAt 
                    }));
                    combinedData.push(...filteredReservationAlerts);
                } else if (reservationAlertResponse.status === 401) { 
                    console.warn("예약 알림: 로그인이 필요하거나 세션이 만료되었습니다. 데이터를 처리하지 않습니다.");
                }
                else if (reservationAlertResponse.status !== 304) {
                    console.warn("예약 알림 데이터가 배열이 아니거나 304가 아닙니다 (예상치 못한 응답 형식):", reservationAlertResponse.data);
                }
                
                // 모든 알림을 시간순으로 정렬
                combinedData.sort((a, b) => {
                    const getDate = (arr) => {
                        if (arr && Array.isArray(arr) && arr.length >= 6) {
                            return new Date(Date.UTC(arr[0], arr[1] - 1, arr[2], arr[3], arr[4], arr[5]));
                        }
                        return new Date(0); 
                    };
                    return getDate(b.createdAt).getTime() - getDate(a.createdAt).getTime(); 
                });


                const todayDateString = new Date().toISOString().split('T')[0];
                const todayNotifications = [];
                const previousNotifications = [];

                combinedData.forEach(item => {
                    let parsedTime;
                    if (item.createdAt && Array.isArray(item.createdAt) && item.createdAt.length >= 6) {
                        const [year, month, day, hour, minute, second] = item.createdAt;
                        parsedTime = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
                    } 
                    else if (item.createdAt) {
                        parsedTime = new Date(item.createdAt); 
                    } else {
                        parsedTime = null;
                    }

                    const formattedItem = {
                        id: item.id,
                        type: item.type,
                        title: item.title,
                        message: item.message,
                        time: ''
                    };

                    if (parsedTime && !isNaN(parsedTime.getTime())) {
                        const noticeDatePart = parsedTime.toISOString().split('T')[0];
                        if (noticeDatePart === todayDateString) {
                            formattedItem.time = parsedTime.toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                            todayNotifications.push(formattedItem);
                        } else {
                            formattedItem.time = formatDate(parsedTime.toISOString());
                            previousNotifications.push(formattedItem);
                        }
                    } else {
                        formattedItem.time = '';
                    }
                });

                setNotifications({ today: todayNotifications, previous: previousNotifications });

            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401) {
                        setError('로그인이 필요합니다. 다시 로그인해주세요.');
                        setNotifications({ today: [], previous: [] });
                    } else if (err.response.status === 404) {
                        setError('알림 API를 찾을 수 없습니다. 백엔드 경로를 확인해주세요.');
                    } else {
                        setError(`알림을 불러오는 데 실패했습니다. (상태 코드: ${err.response.status})`);
                        console.error("서버 응답 에러 상세:", err.response.data);
                    }
                } else {
                    setError('알림을 불러오는 중 네트워크 오류가 발생했습니다.');
                    console.error("알림을 가져오는 중 예상치 못한 에러 발생:", err);
                }
            } finally {
                setIsLoading(false);
            }
        };

        // user나 isAuthenticated, isLoadingAuth가 변경될 때마다 fetchAllNotifications를 다시 호출
        // 이렇게 해야 인증 상태가 변경될 때 알림도 다시 로드됩니다.
        fetchAllNotifications();
    }, [user, isAuthenticated, isLoadingAuth]); 

    //  AuthProvider의 로딩 상태를 알림 로딩에 반영 
    if (isLoadingAuth || isLoading) {
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
                    <h3 className="lg font-bold text-gray-800 mb-4">이전 알림</h3>
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