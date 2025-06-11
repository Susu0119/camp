import { useAuth } from '../../utils/Auth';
import { useNotification } from '../../utils/NotificationContext';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { apiCore } from '../../utils/Auth';

export default function Sender() {
    const { user } = useAuth();
    const { connected, sendAlert } = useNotification();
    const [targetInput, setTargetInput] = useState('');
    const [targetUser, setTargetUser] = useState(null);
    const [role, setRole] = useState('1');
    const [loading, setLoading] = useState(false);
    const [customMessage, setCustomMessage] = useState('');
    const [connectedUserInfos, setConnectedUserInfos] = useState([]);
    const [broadcastMessage, setBroadcastMessage] = useState('');

    // 사용자 검색 (닉네임)
    const handleSearch = async () => {
        setTargetUser(null);
        if (!targetInput.trim()) {
            Swal.fire('입력 필요', '사용자 닉네임을 입력하세요.', 'warning');
            return;
        }
        setLoading(true);
        try {
            // 닉네임으로만 검색
            const res = await apiCore.get(`/admin/users/search?keyword=${encodeURIComponent(targetInput.trim())}`);
            const data = res.data;
            console.log('닉네임 검색 결과:', data, '입력값:', targetInput.trim());
            if (data.length > 0) {
                const user = data[0];
                // 상세 정보도 필요하면 아래 코드 유지, userRole은 search 결과에서 가져옴
                let detailUser = null;
                try {
                    const detailRes = await apiCore.get(`/admin/users/detail?providerCode=1&providerUserId=${encodeURIComponent(user.providerUserId)}`);
                    detailUser = detailRes.data;
                } catch (e) {
                    console.error('상세 정보 조회 에러:', e, 'providerUserId:', user.providerUserId);
                    Swal.fire('오류', '상세 정보 조회 중 오류가 발생했습니다.', 'error');
                    setLoading(false);
                    return;
                }
                setTargetUser({ ...detailUser, userRole: user.userRole });
            } else {
                Swal.fire('검색 결과 없음', '해당 닉네임의 사용자를 찾을 수 없습니다.', 'error');
            }
        } catch (e) {
            console.error('닉네임 검색 에러:', e, '입력값:', targetInput.trim());
            Swal.fire('오류', '닉네임 검색 중 오류가 발생했습니다.', 'error');
        } finally {
            setLoading(false);
        }
    };

    // 권한 변경
    const handleChangeRole = async () => {
        if (!targetUser) return;
        setLoading(true);
        try {
            const res = await fetch('/web/admin/users/role', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    providerCode: targetUser.providerCode,
                    providerUserId: targetUser.providerUserId,
                    role: Number(role)
                })
            });
            const result = await res.json();
            const roleLabel = {
                1: '일반 사용자',
                2: '캠핑장 관계자',
                3: '관리자'
            }[role];
            if (res.ok) {
                const msg = `${targetUser.nickname}님의 권한이 '${roleLabel}'(으)로 변경되었습니다.`;
                await sendAlert(targetUser.providerUserId, msg);
                Swal.fire('성공', msg, 'success');
            } else {
                Swal.fire('실패', result.message || '권한 변경에 실패했습니다.', 'error');
            }
        } catch (e) {
            Swal.fire('오류', '권한 변경 중 오류가 발생했습니다.', 'error');
        }
        setLoading(false);
    };

    // 원하는 사용자에게 원하는 문구로 알림 보내기
    const handleSendCustomAlert = async () => {
        if (!targetUser) {
            Swal.fire('대상 없음', '먼저 사용자 검색을 해주세요.', 'warning');
            return;
        }
        if (!customMessage.trim()) {
            Swal.fire('입력 필요', '보낼 메시지를 입력하세요.', 'warning');
            return;
        }
        setLoading(true);
        try {
            const msgObj = {
                text: customMessage.trim(),
                fromUserId: user.providerUserId,
                fromNickname: user.nickname || user.providerUserId
            };
            await sendAlert(targetUser.providerUserId, JSON.stringify(msgObj));
            Swal.fire('전송 완료', '알림이 전송되었습니다.', 'success');
            setCustomMessage('');
        } catch (e) {
            Swal.fire('오류', '알림 전송 중 오류가 발생했습니다.', 'error');
        }
        setLoading(false);
    };

    // 현재 접속 중인 사용자 목록 주기적 조회 (닉네임 포함)
    useEffect(() => {
        const fetchConnectedUsers = async () => {
            try {
                const res = await apiCore.get('/alert/connected-users');
                const userIds = res.data;
                const infos = await Promise.all(
                    userIds.map(async (uid) => {
                        try {
                            const res = await apiCore.get(`/api/user/mypage/1/${encodeURIComponent(uid)}`);
                            const user = res.data;
                            return { userId: uid, nickname: user.nickname || '(닉네임 없음)' };
                        } catch {
                            return { userId: uid, nickname: '(조회 실패)' };
                        }
                    })
                );
                setConnectedUserInfos(infos);
            } catch (e) {
                setConnectedUserInfos([]);
            }
        };
        fetchConnectedUsers();
        const interval = setInterval(fetchConnectedUsers, 5000);
        return () => clearInterval(interval);
    }, []);

    // 모든 접속자에게 커스텀 알림 보내기
    const handleBroadcastAlert = async () => {
        if (!broadcastMessage.trim()) {
            Swal.fire('입력 필요', '보낼 메시지를 입력하세요.', 'warning');
            return;
        }
        if (connectedUserInfos.length === 0) {
            Swal.fire('대상 없음', '현재 접속 중인 사용자가 없습니다.', 'warning');
            return;
        }
        setLoading(true);
        try {
            const msgObj = {
                text: broadcastMessage.trim(),
                fromUserId: user.providerUserId,
                fromNickname: user.nickname || user.providerUserId
            };
            await Promise.all(
                connectedUserInfos.map(info =>
                    sendAlert(info.userId, JSON.stringify(msgObj))
                )
            );
            Swal.fire('전송 완료', '모든 접속자에게 알림이 전송되었습니다.', 'success');
            setBroadcastMessage('');
        } catch (e) {
            Swal.fire('오류', '알림 전송 중 오류가 발생했습니다.', 'error');
        }
        setLoading(false);
    };

    if (!user) {
        return <h1>로그인이 필요합니다.</h1>;
    }

    return (
        <div>
            <p style={{ color: connected ? 'green' : 'red' }}>
                상태: {connected ? '연결됨 ' : '연결 안됨 '}
            </p>
            <p>내 사용자 ID: {user.providerUserId}</p>
            <div style={{ margin: '10px 0', padding: '10px', background: '#f8f8f8', borderRadius: 6 }}>
                <b>현재 접속 중인 사용자:</b>
                <ul style={{ margin: 0, paddingLeft: 20 }}>
                    {connectedUserInfos.length === 0 ? (
                        <li>없음</li>
                    ) : (
                        connectedUserInfos.map(info => (
                            <li key={info.userId}>
                                {info.nickname} <span style={{ color: '#888' }}>({info.userId})</span>
                            </li>
                        ))
                    )}
                </ul>
            </div>

            <div style={{ marginTop: '30px', maxWidth: 400, border: '1px solid #eee', borderRadius: 8, padding: 20 }}>
                <h2>사용자 권한 변경</h2>
                <input
                    type="text"
                    value={targetInput}
                    onChange={e => setTargetInput(e.target.value)}
                    placeholder="사용자 닉네임 입력"
                    style={{
                        width: '100%',
                        padding: '8px',
                        border: '1px solid #ddd',
                        borderRadius: '4px',
                        marginBottom: '10px'
                    }}
                    disabled={loading}
                />
                <button
                    onClick={handleSearch}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#6d28d9',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                        marginBottom: '10px'
                    }}
                    disabled={loading}
                >
                    사용자 검색
                </button>
                {targetUser && (
                    <div style={{ marginTop: 10 }}>
                        <div>닉네임: <b>{targetUser.nickname}</b></div>
                        <div>ID: <b>{targetUser.providerUserId}</b></div>
                        <div>현재 권한: <b>{targetUser.userRole ?? targetUser.role ?? targetUser.user_role ?? '없음'}</b></div>
                        <select value={role} onChange={e => setRole(e.target.value)} style={{ marginTop: 10, width: '100%', padding: 8 }}>
                            <option value="1">일반 사용자</option>
                            <option value="2">캠핑장 관계자</option>
                            <option value="3">관리자</option>
                        </select>
                        <button
                            onClick={handleChangeRole}
                            style={{
                                width: '100%',
                                padding: '10px',
                                backgroundColor: '#28a745',
                                color: 'white',
                                border: 'none',
                                borderRadius: '4px',
                                cursor: 'pointer',
                                marginTop: '10px'
                            }}
                            disabled={loading}
                        >
                            권한 변경 및 알림 전송
                        </button>
                        <div style={{ marginTop: 20 }}>
                            <h3>커스텀 알림 보내기</h3>
                            <textarea
                                value={customMessage}
                                onChange={e => setCustomMessage(e.target.value)}
                                placeholder="보낼 메시지를 입력하세요"
                                rows={3}
                                style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }}
                                disabled={loading}
                            />
                            <button
                                onClick={handleSendCustomAlert}
                                style={{
                                    width: '100%',
                                    padding: '10px',
                                    backgroundColor: '#ff9800',
                                    color: 'white',
                                    border: 'none',
                                    borderRadius: '4px',
                                    cursor: 'pointer'
                                }}
                                disabled={loading}
                            >
                                커스텀 알림 보내기
                            </button>
                        </div>
                    </div>
                )}
            </div>

            <div style={{ marginTop: 30, maxWidth: 400, border: '1px solid #eee', borderRadius: 8, padding: 20 }}>
                <h2>전체 접속자에게 커스텀 알림 보내기</h2>
                <textarea
                    value={broadcastMessage}
                    onChange={e => setBroadcastMessage(e.target.value)}
                    placeholder="모든 접속자에게 보낼 메시지를 입력하세요"
                    rows={3}
                    style={{ width: '100%', padding: 8, borderRadius: 4, border: '1px solid #ccc', marginBottom: 8 }}
                    disabled={loading}
                />
                <button
                    onClick={handleBroadcastAlert}
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#ff5722',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                    disabled={loading}
                >
                    전체 접속자에게 알림 보내기
                </button>
            </div>
        </div>
    );
} 