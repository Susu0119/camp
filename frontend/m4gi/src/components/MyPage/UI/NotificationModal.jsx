import React, { useState, useEffect } from 'react';
import NotificationItem from './NotificationItem';
import axios from 'axios';

// 알림 제목에 따라 타입을 결정하는 유틸리티 함수
const getTypeFromTitle = (title) => {
    if (title.includes('예약')) return 'reservation';
    if (title.includes('리뷰') || title.includes('후기')) return 'review';
    if (title.includes('환영')) return 'welcome';
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

export default function NotificationModal() {
    // 알림 데이터를 오늘 알림과 이전 알림으로 나누어 관리
    const [notifications, setNotifications] = useState({ today: [], previous: [] });
    // 데이터 로딩 상태
    const [isLoading, setIsLoading] = useState(true);
    // 에러 메시지
    const [error, setError] = useState(null);

    // 컴포넌트 마운트 시 또는 종 모양 아이콘 클릭으로 모달이 열릴 때 알림 데이터를 가져옴
    useEffect(() => {
        const fetchNotices = async () => {
            setIsLoading(true); // 로딩 시작
            setError(null);    // 에러 초기화
            try {
                // axios.get 요청에 withCredentials, headers, validateStatus 옵션 추가
                const response = await axios.get('/web/api/notices/user/alerts', {
                    withCredentials: true, // 세션 쿠키 (JSESSIONID)를 백엔드로 함께 보냅니다. 로그인 상태 유지에 필수.
                    headers: {
                        // 캐싱을 방지하는 헤더를 추가하여 항상 최신 데이터를 요청하도록 합니다.
                        // 개발 중 304 Not Modified 문제를 줄이는 데 유용합니다.
                        'Cache-Control': 'no-cache, no-store, must-revalidate',
                        'Pragma': 'no-cache',
                        'Expires': '0',
                    },
                    // HTTP 상태 코드가 2xx (성공) 또는 304 (Not Modified)일 경우에만 성공으로 처리합니다.
                    // 304일 때도 catch 블록으로 넘어가지 않도록 합니다.
                    validateStatus: function (status) {
                        return status >= 200 && status < 300 || status === 304;
                    },
                });

                let data = response.data; // 서버 응답의 실제 데이터 (JSON)

                // HTTP 상태 코드가 304 Not Modified인 경우, 서버는 응답 바디를 보내지 않습니다.
                // 따라서 data가 비어있을 수 있으므로, 이 경우 빈 배열로 처리하여 forEach 에러를 방지합니다.
                if (response.status === 304) {
                    console.log("304 Not Modified 응답을 받았습니다. 캐시된 데이터를 사용하거나 알림 없음으로 처리합니다.");
                    data = []; // 알림 데이터가 없다고 간주하고 빈 배열로 초기화
                }

                // 🚨 중요: 서버 응답이 배열이 아닐 경우를 대비한 방어 로직.
                // 304 처리를 했음에도 여전히 HTML이나 다른 형식이 온다면,
                // Vite 프록시 설정 또는 백엔드 라우팅 문제일 가능성이 매우 높습니다.
                if (!Array.isArray(data)) {
                    console.error("서버 응답 데이터가 예상과 다릅니다: 배열이 아님", data);
                    setError("알림 데이터를 불러오는 데 실패했습니다: 유효하지 않은 형식.");
                    setIsLoading(false);
                    return; // 배열이 아니면 더 이상 처리하지 않고 함수 종료
                }

                const today = new Date().toISOString().split('T')[0]; // 오늘 날짜 (YYYY-MM-DD)
                const todayNotices = []; // 오늘 받은 알림을 저장할 배열
                const previousNotices = []; // 이전 알림을 저장할 배열

                // 받아온 알림 데이터를 순회하며 '오늘 받은 알림'과 '이전 알림'으로 분류하고 포맷팅
                data.forEach(notice => {
                    const formattedNotice = {
                        id: notice.notice_id, // 알림 ID
                        type: getTypeFromTitle(notice.notice_title), // 알림 제목에 따른 타입
                        title: notice.notice_title, // 알림 제목
                        message: notice.notice_content, // 알림 내용
                        time: notice.created_at, // 원본 created_at (날짜+시간 포함)
                    };

                    // created_at이 'YYYY-MM-DDTHH:MM:SS' 형식이라고 가정하고 오늘 날짜와 비교
                    if (notice.created_at && String(notice.created_at).startsWith(today)) {
                        // 오늘 받은 알림이면 시간만 'HH:MM' 형식으로 표시
                        formattedNotice.time = new Date(notice.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit', hour12: false });
                        todayNotices.push(formattedNotice);
                    } else {
                        // 이전 알림이면 날짜만 'YYYY.MM.DD' 형식으로 표시
                        formattedNotice.time = formatDate(notice.created_at);
                        previousNotices.push(formattedNotice);
                    }
                });

                // 각 알림 목록을 최신순으로 정렬 (시간 또는 날짜 기준)
                todayNotices.sort((a, b) => new Date(b.time) - new Date(a.time));
                previousNotices.sort((a, b) => new Date(b.time) - new Date(a.time));

                // 정렬된 알림 목록으로 상태 업데이트
                setNotifications({ today: todayNotices, previous: previousNotices });

            } catch (err) {
                // Axios 에러 (네트워크 문제, 서버 응답 에러 등) 처리
                if (axios.isAxiosError(err) && err.response) {
                    if (err.response.status === 401) {
                        setError('로그인이 필요합니다. 다시 로그인해주세요.');
                    } else if (err.response.status === 404) {
                        setError('알림 API를 찾을 수 없습니다. 백엔드 경로를 확인해주세요.');
                    } else {
                        // 그 외 다른 HTTP 상태 코드 에러 처리
                        setError(`알림을 불러오는 데 실패했습니다. (상태 코드: ${err.response.status})`);
                        console.error("서버 응답 에러 상세:", err.response.data);
                    }
                } else {
                    // Axios 에러가 아닌 일반적인 네트워크 오류 또는 예상치 못한 에러 처리
                    setError('알림을 불러오는 중 네트워크 오류가 발생했습니다.');
                    console.error("알림을 가져오는 중 예상치 못한 에러 발생:", err);
                }
            } finally {
                setIsLoading(false); // 로딩 종료 (성공 또는 실패 여부와 관계없이)
            }
        };

        fetchNotices(); // 컴포넌트가 마운트될 때 fetchNotices 함수 호출
    }, []); // 빈 의존성 배열은 이 useEffect 훅이 컴포넌트가 처음 렌더링될 때 한 번만 실행되도록 합니다.

    // 로딩 중일 때 표시할 UI
    if (isLoading) {
        return (
            <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-5 text-center">
                <p className="text-gray-600">알림을 불러오는 중입니다...</p>
            </div>
        );
    }

    // 에러 발생 시 표시할 UI
    if (error) {
        return (
            <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-5 text-center">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    // 알림 내역이 없을 때 표시할 UI
    if (notifications.today.length === 0 && notifications.previous.length === 0) {
        return (
            <div className="absolute top-full right-0 mt-4 w-[450px] bg-[#FDF4FF] rounded-xl shadow-2xl z-10 p-10 text-center">
                <p className="text-lg text-gray-500">알림 내역이 없습니다.</p>
            </div>
        );
    }

    // 알림 내역이 있을 때 표시할 UI
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