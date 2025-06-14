import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem'; // NotificationItem 컴포넌트 임포트
import axios from 'axios'; // axios 라이브러리 임포트

// 알림 제목에 따라 타입을 결정하는 유틸리티 함수
const getTypeFromTitle = (title) => {
    if (!title || typeof title !== 'string') {
        return 'default';
    }

    if (title.includes('예약')) return 'reservation';
    if (title.includes('리뷰') || title.includes('후기')) return 'review';
    if (title.includes('환영')) return 'welcome';
    if (title.includes('캠핑 3일 전') || title.includes('캠핑 하루 전') || title.includes('오늘 캠핑 시작')) return 'reservation';
    
    return 'default';
};

// 날짜 문자열을 "YYYY.MM.DD" 형식으로 포맷하는 유틸리티 함수
const formatDate = (dateString) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}.${month}.${day}`;
};

// 🌟🌟🌟 캠핑장 이름을 추출하고 예약 ID를 제거하여 메시지를 재구성하는 함수 🌟🌟🌟
const formatNoticeContent = (content) => {
    let campingSpotName = '';
    let processedContent = content;

    // 1. "'캠핑장'" 형태의 문자열에서 캠핑장 이름을 추출
    // 백엔드에서 `'캠핑장'`이라고 하드코딩된 문자열을 가정하고, 따옴표 안의 내용을 캡처
    const nameExtractionRegex = /'([^']+)'\s*예약/; // 예: "'캠핑장' 예약" 에서 "캠핑장" 추출
    const nameMatch = processedContent.match(nameExtractionRegex);

    if (nameMatch && nameMatch[1]) {
        campingSpotName = nameMatch[1]; // 추출된 캠핑장 이름 (예: "캠핑장")
        // 추출된 부분을 원본 문자열에서 제거합니다.
        // 예를 들어, "'캠핑장' 예약 (예약번호:...)이 성공적으로 완료되었습니다." 에서
        // "'캠핑장' 예약" 부분을 제거하여 "(예약번호:...)이 성공적으로 완료되었습니다." 로 만듭니다.
        processedContent = processedContent.replace(nameExtractionRegex, ' '); 
    }

    // 2. 예약번호 제거 (기존 로직 유지)
    const reservationIdRegex = /\s*\(예약번호: [a-zA-Z0-9]+\)/;
    processedContent = processedContent.replace(reservationIdRegex, '');

    // 3. 최종 메시지 재구성
    // 추출된 캠핑장 이름이 있다면 그 이름을 사용하여 메시지를 구성
    if (campingSpotName) {
        // 제거 후 남은 텍스트에 "예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!"와 같은 패턴이 있는지 확인
        // 백엔드에서 내려오는 원본 문자열: "'캠핑장' 예약 (예약번호: ZswEtyPLMJLlnDvmYixZqSjCXAeNUuNPORdazNLqGmhforAYsr)이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!"
        // 1. 예약번호 제거 후: "'캠핑장' 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!"
        // 2. '캠핑장' 추출 후: " 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!"
        // 이제 "캠핑장" + "예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!" 형태로 만듭니다.
        return `'${campingSpotName}' 예약이 성공적으로 완료되었습니다. 즐거운 캠핑 되세요!`.trim();
    } else {
        // 캠핑장 이름을 추출하지 못했다면, 예약번호만 제거된 원본 메시지를 반환
        return processedContent.trim();
    }
};


export default function NotificationModal() {
    const [notifications, setNotifications] = useState({ today: [], previous: [] });
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchNotices = async () => {
            setIsLoading(true);
            setError(null);
            try {
                const response = await axios.get('/web/api/notices/user/alerts', {
                    withCredentials: true,
                    headers: {
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                    validateStatus: function (status) {
                        return status >= 200 && status < 300 || status === 304;
                    },
                });

                console.log("--- 서버 응답 데이터 (response.data) RAW ---");
                console.log(response.data);
                console.log("------------------------------------------");

                let data = response.data;

                if (response.status === 304) {
                    console.log("304 Not Modified 응답을 받았습니다. 캐시된 데이터를 사용하거나 알림 없음으로 처리합니다.");
                    data = [];
                }

                if (!Array.isArray(data)) {
                    console.error("서버 응답 데이터가 예상과 다릅니다: 배열이 아님", data);
                    setError("알림 데이터를 불러오는 데 실패했습니다: 유효하지 않은 형식.");
                    setIsLoading(false);
                    return;
                }

                const today = new Date().toISOString().split('T')[0];
                const todayNotices = [];
                const previousNotices = [];

                data.forEach(notice => {
                    console.log("현재 처리 중인 개별 알림 객체:", notice); 
                    
                    const formattedNotice = {
                        id: notice.noticeId,
                        type: getTypeFromTitle(notice.noticeTitle),
                        title: notice.noticeTitle,
                        message: formatNoticeContent(notice.noticeContent), // formatNoticeContent 적용
                        time: '', 
                    };

                    let parsedTime;
                    if (notice.createdAt && Array.isArray(notice.createdAt) && notice.createdAt.length >= 6) {
                        const [year, month, day, hour, minute, second] = notice.createdAt;
                        parsedTime = new Date(Date.UTC(year, month - 1, day, hour, minute, second));
                    } else if (notice.createdAt) {
                        parsedTime = new Date(notice.createdAt); 
                    } else {
                        parsedTime = null;
                    }

                    if (parsedTime && !isNaN(parsedTime.getTime())) {
                        formattedNotice.time = parsedTime.toISOString();
                    } else {
                        formattedNotice.time = '';
                    }

                    const noticeDatePart = formattedNotice.time.split('T')[0];
                    if (noticeDatePart === today) {
                        formattedNotice.time = new Date(formattedNotice.time).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                        todayNotices.push(formattedNotice);
                    } else {
                        formattedNotice.time = formatDate(formattedNotice.time);
                        previousNotices.push(formattedNotice);
                    }
                });

                todayNotices.sort((a, b) => new Date(b.time) - new Date(a.time));
                previousNotices.sort((a, b) => new Date(b.time) - new Date(a.time));

                setNotifications({ today: todayNotices, previous: previousNotices });

            } catch (err) {
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401) {
                        setError('로그인이 필요합니다. 다시 로그인해주세요.');
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