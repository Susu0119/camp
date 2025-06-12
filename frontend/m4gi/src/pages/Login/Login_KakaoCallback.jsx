// Login_KakaoCallback.jsx

import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth, apiCore } from '../../utils/Auth.jsx';
import Swal from 'sweetalert2';

export default function LoginKakaoCallback() {
    const navigate = useNavigate();
    const location = useLocation();
    const { login } = useAuth();

    useEffect(() => {
        // URLSearchParams를 사용하여 'code' 파라미터 추출
        const code = new URLSearchParams(location.search).get('code');
        console.log('Login_KakaoCallback: 카카오 인가 코드:', code);

        if (code) {
            // 백엔드로 인가 코드 전달
            apiCore.post('/oauth/kakao/callback', {
                code: code
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
                .then(response => {
                    console.log('Login_KakaoCallback: 백엔드 응답:', response.data);

                    if (response.status === 200 && response.data.user) {
                        // 로그인 성공 (기존 사용자, 전화번호 있음)

                        login(response.data.user); // 토큰 없이 사용자 정보만 전달

                        navigate('/main'); // 메인 페이지로 SPA 내에서 이동

                    } else if (response.status === 202 && response.data.kakaoId) {
                        // 전화번호 입력 필요 (신규 사용자 또는 전화번호 없음)
                        navigate('/phone-input', { // 전화번호 입력 페이지로 SPA 내에서 이동
                            state: {
                                kakaoId: response.data.kakaoId,
                                email: response.data.email,
                                nickname: response.data.nickname
                            }
                        });
                    } else {
                        // 예상치 못한 성공 응답 (사용자 정보 누락 등)
                        console.error('Login_KakaoCallback: 로그인 처리 실패 (응답 데이터 부족)', response.data);
                        alert('로그인에 실패했습니다. 다시 시도해주세요.');
                        navigate('/login');
                    }
                })
                .catch(error => {
                    console.error('Login_KakaoCallback: 카카오 로그인 최종 실패:', error);

                    if (error.response) {
                        console.log('Login_KakaoCallback: 에러 상태:', error.response.status);
                        console.log('Login_KakaoCallback: 에러 메시지:', error.response.data);

                        if (error.response.status === 202 && error.response.data.kakaoId) {
                            // 전화번호 입력 필요 (에러 응답으로 오는 경우)
                            console.log('Login_KakaoCallback: 전화번호 입력이 필요합니다. (에러 응답)');
                            navigate('/phone-input', {
                                state: {
                                    kakaoId: error.response.data.kakaoId,
                                    email: error.response.data.email,
                                    nickname: error.response.data.nickname
                                }
                            });
                        } else if (error.response.status === 403) {
                            Swal.fire({
                                icon: 'error',
                                title: '로그인 실패',
                                text: '탈퇴했거나 이용이 정지된 계정입니다.',
                                confirmButtonColor: '#8C06AD'
                            }).then(() => {
                                navigate('/login');
                            });
                        } else {
                            Swal.fire({
                                icon: 'error',
                                title: '로그인 실패',
                                text: '로그인 중 오류가 발생했습니다다.',
                                confirmButtonColor: '#8C06AD'
                            }).then(() => {
                                navigate('/login');
                            });
                        }
                    } else {
                        alert('네트워크 오류 또는 알 수 없는 오류가 발생했습니다.');
                        navigate('/login');
                    }
                });
        } else {
            console.error('Login_KakaoCallback: 인가 코드가 없습니다.');
            alert('카카오 로그인 인가 코드가 없습니다. 로그인 페이지로 돌아갑니다.');
            navigate('/login'); // 또는 로그인 페이지 경로
        }
        // login 함수를 의존성 배열에 추가 (AuthProvider에서 useCallback으로 감싸져 있으므로 안정적)
        // location 객체는 변경될 수 있으므로 추가
    }, [navigate, location, login]);

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            flexDirection: 'column'
        }}>
            <div>카카오 로그인 처리 중...</div>
            <div style={{ marginTop: '10px', fontSize: '14px', color: '#666' }}>
                잠시만 기다려주세요.
            </div>
        </div>
    );
}