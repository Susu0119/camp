import React, { createContext, useContext, useEffect, useState } from 'react';
import { useAuth } from './Auth';
import Swal from 'sweetalert2';

const NotificationContext = createContext();

export function NotificationProvider({ children }) {
    const { user, checkServerLoginStatus } = useAuth();
    const [connected, setConnected] = useState(false);
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        if (!user || !user.providerUserId) {
            return;
        }

        const eventSource = new EventSource(`/web/subscribe/${user.providerUserId}`);

        eventSource.onopen = () => {
            console.log('SSE 연결됨');
            setConnected(true);
        };

        eventSource.addEventListener('connect', (event) => {
            console.log('연결 메시지:', event.data);
            setConnected(true);
        });

        eventSource.addEventListener('alert', async (event) => {
            let msgObj = null;
            try {
                msgObj = JSON.parse(event.data);
            } catch {
                // 일반 텍스트 메시지
            }
            setNotifications(prev => [{
                id: Date.now(),
                message: event.data,
                timestamp: new Date()
            }, ...prev]);
            if (msgObj && msgObj.text && msgObj.fromUserId && msgObj.fromNickname) {
                Swal.fire({
                    title: `${msgObj.fromNickname}님의 메시지`,
                    text: msgObj.text,
                    icon: 'info',
                    showCancelButton: true,
                    confirmButtonText: '답장',
                    cancelButtonText: '닫기',
                    input: 'text',
                    inputPlaceholder: '답장 내용을 입력하세요',
                    inputValidator: (value) => {
                        if (!value) return '답장 내용을 입력하세요';
                    }
                }).then(async (result) => {
                    if (result.isConfirmed && result.value) {
                        // 답장 전송
                        const reply = {
                            text: result.value,
                            fromUserId: user.providerUserId,
                            fromNickname: user.nickname || user.providerUserId
                        };
                        await sendAlert(msgObj.fromUserId, JSON.stringify(reply));
                        Swal.fire('전송 완료', '답장이 전송되었습니다.', 'success');
                    }
                });
            } else if (event.data.includes('권한이')) {
                Swal.fire('권한 변경', event.data, 'info');
                // 권한 변경 알림 수신 시 user 정보 즉시 갱신
                if (typeof checkServerLoginStatus === 'function') {
                    await checkServerLoginStatus();
                }
            } else {
                alert(event.data);
            }
        });

        eventSource.onerror = (error) => {
            console.error('연결 에러:', error);
            setConnected(false);
        };

        return () => {
            eventSource.close();
            setConnected(false);
        };
    }, [user, checkServerLoginStatus]);

    const sendAlert = async (userId, message = '새로운 알림이 도착했습니다!') => {
        try {
            console.log('전송 시도:', userId, message); // 디버깅용
            const response = await fetch(`/web/alert/${userId}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json', // 또는 'text/plain'
                },
                body: typeof message === 'string' ? message : JSON.stringify(message),
            });
            const result = await response.text();
            console.log('알림 전송 결과:', result);
            return result;
        } catch (error) {
            console.error('알림 전송 실패:', error);
            throw error;
        }
    };

    return (
        <NotificationContext.Provider value={{
            connected,
            notifications,
            sendAlert
        }}>
            {children}
        </NotificationContext.Provider>
    );
}

export function useNotification() {
    const context = useContext(NotificationContext);
    if (!context) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
} 