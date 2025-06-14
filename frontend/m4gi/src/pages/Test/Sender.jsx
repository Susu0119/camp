import { useAuth } from '../../utils/Auth';
import { useNotification } from '../../utils/NotificationContext';
import { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import { apiCore } from '../../utils/Auth';

export default function Sender() {
    // ====== 상태 및 훅 ======
    const { user, checkServerLoginStatus } = useAuth();
    const { connected, sendAlert } = useNotification();
    const [targetInput, setTargetInput] = useState('');
    const [targetUser, setTargetUser] = useState(null);
    const [role, setRole] = useState('1');
    const [loading, setLoading] = useState(false);
    const [customMessage, setCustomMessage] = useState('');
    const [connectedUserInfos, setConnectedUserInfos] = useState([]);
    const [broadcastMessage, setBroadcastMessage] = useState('');

    // ====== 사용자 검색 ======
    const handleSearch = async () => {
        setTargetUser(null);
        if (!targetInput.trim()) {
            Swal.fire('입력 필요', '사용자 닉네임을 입력하세요.', 'warning');
            return;
        }
        setLoading(true);
        try {
            const res = await apiCore.get(`/admin/users/search?keyword=${encodeURIComponent(targetInput.trim())}`);
            const data = res.data;
            if (data.length > 0) {
                const user = data[0];
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

    // ====== 권한 변경 ======
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
                // 본인 권한이 바뀐 경우, user 정보 즉시 갱신
                if (user && user.providerUserId === targetUser.providerUserId) {
                    await checkServerLoginStatus();
                }
            } else {
                Swal.fire('실패', result.message || '권한 변경에 실패했습니다.', 'error');
            }
        } catch (e) {
            Swal.fire('오류', '권한 변경 중 오류가 발생했습니다.', 'error');
        }
        setLoading(false);
    };

    // ====== 커스텀 알림 보내기 ======
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

    // ====== 접속자 목록 주기적 조회 ======
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

    // ====== 전체 접속자에게 커스텀 알림 보내기 ======
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

    // ====== 렌더링 ======
    if (!user) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl font-semibold text-gray-700">로그인이 필요합니다.</div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center min-h-screen bg-gray-50 py-10">
            <div className="w-full max-w-xl space-y-8">
                {/* 상태 및 내 정보 */}
                <div className="bg-white rounded-xl shadow p-6 flex flex-col gap-2">
                    <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${connected ? 'bg-green-500' : 'bg-red-400'}`}></span>
                        <span className="text-sm font-medium">상태: {connected ? '연결됨' : '연결 안됨'}</span>
                    </div>
                    <div className="text-sm text-gray-600">내 사용자 ID: <b>{user.providerUserId}</b></div>
                </div>

                {/* 접속자 목록 */}
                <div className="bg-white rounded-xl shadow p-6">
                    <div className="font-semibold mb-2">현재 접속 중인 사용자</div>
                    <ul className="list-disc pl-5 text-gray-700 text-sm">
                        {connectedUserInfos.length === 0 ? (
                            <li>없음</li>
                        ) : (
                            connectedUserInfos.map(info => (
                                <li key={info.userId}>
                                    {info.nickname} <span className="text-gray-400">({info.userId})</span>
                                </li>
                            ))
                        )}
                    </ul>
                </div>

                {/* 권한 변경 섹션 */}
                <div className="bg-white rounded-xl shadow p-6 space-y-4">
                    <h2 className="text-lg font-bold mb-2">사용자 권한 변경</h2>
                    <input
                        type="text"
                        value={targetInput}
                        onChange={e => setTargetInput(e.target.value)}
                        placeholder="사용자 닉네임 입력"
                        className="w-full px-4 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-purple-300"
                        disabled={loading}
                    />
                    <button
                        onClick={handleSearch}
                        className="w-full py-2 bg-purple-600 hover:bg-purple-700 text-white rounded font-semibold transition"
                        disabled={loading}
                    >
                        사용자 검색
                    </button>
                    {targetUser && (
                        <div className="space-y-2 mt-4">
                            <div>닉네임: <b>{targetUser.nickname}</b></div>
                            <div>ID: <b>{targetUser.providerUserId}</b></div>
                            <div>현재 권한: <b>{targetUser.userRole ?? targetUser.role ?? targetUser.user_role ?? '없음'}</b></div>
                            <select
                                value={role}
                                onChange={e => setRole(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded mt-2"
                            >
                                <option value="1">일반 사용자</option>
                                <option value="2">캠핑장 관계자</option>
                                <option value="3">관리자</option>
                            </select>
                            <button
                                onClick={handleChangeRole}
                                className="w-full py-2 bg-green-600 hover:bg-green-700 text-white rounded font-semibold mt-2 transition"
                                disabled={loading}
                            >
                                권한 변경 및 알림 전송
                            </button>
                            {/* 커스텀 알림 */}
                            <div className="mt-4">
                                <h3 className="font-semibold mb-1">커스텀 알림 보내기</h3>
                                <textarea
                                    value={customMessage}
                                    onChange={e => setCustomMessage(e.target.value)}
                                    placeholder="보낼 메시지를 입력하세요"
                                    rows={3}
                                    className="w-full px-3 py-2 border border-gray-300 rounded mb-2 focus:outline-none focus:ring-2 focus:ring-orange-200"
                                    disabled={loading}
                                />
                                <button
                                    onClick={handleSendCustomAlert}
                                    className="w-full py-2 bg-orange-500 hover:bg-orange-600 text-white rounded font-semibold transition"
                                    disabled={loading}
                                >
                                    커스텀 알림 보내기
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* 전체 접속자 알림 */}
                <div className="bg-white rounded-xl shadow p-6 space-y-3">
                    <h2 className="text-lg font-bold mb-2">전체 접속자에게 커스텀 알림 보내기</h2>
                    <textarea
                        value={broadcastMessage}
                        onChange={e => setBroadcastMessage(e.target.value)}
                        placeholder="모든 접속자에게 보낼 메시지를 입력하세요"
                        rows={3}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-200"
                        disabled={loading}
                    />
                    <button
                        onClick={handleBroadcastAlert}
                        className="w-full py-2 bg-red-500 hover:bg-red-600 text-white rounded font-semibold transition"
                        disabled={loading}
                    >
                        전체 접속자에게 알림 보내기
                    </button>
                </div>
            </div>
        </div>
    );
} 