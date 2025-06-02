import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Auth } from '../../utils/Auth.jsx';

export default function LoginKakaoCallback() {
    const navigate = useNavigate();

    useEffect(() => {
        const code = new URL(window.location.href).searchParams.get('code');
        console.log('카카오 인가 코드:', code);

        if (code) {
            // 백엔드로 인가 코드 전달
            axios.post('web/oauth/kakao/callback', {
                code: code
            }, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            })
            .then(response => {
                console.log('백엔드 응답:', response.data);
                
                if (response.status === 200) {
                    // 로그인 성공 (기존 사용자, 전화번호 있음)
                    console.log('로그인 성공!');
                    
                    // JWT 토큰 저장
                    if (response.data.token) {
                        Auth.setToken(response.data.token);
                    }
                    
                    // 사용자 정보 저장
                    if (response.data.user) {
                        Auth.setUserInfo(response.data.user);
                    }
                    
                    alert('로그인 성공!');
                    navigate('/'); // 메인 페이지로 이동
                } else if (response.status === 202) {
                    // 전화번호 입력 필요 (신규 사용자 또는 전화번호 없음)
                    console.log('전화번호 입력이 필요합니다.');
                    alert('전화번호 입력이 필요합니다.');
                    const kakaoId = response.data.kakaoId;
                    const email = response.data.email;
                    const nickname = response.data.nickname;
                    
                    if (kakaoId) {
                        navigate('/phone-input', { 
                            state: { 
                                kakaoId,
                                email,
                                nickname
                            } 
                        });
                    } else {
                        alert('카카오 ID를 받지 못했습니다.');
                        navigate('/');
                    }
                }
            })
            .catch(error => {
                console.error('카카오 로그인 실패:', error);
                
                if (error.response) {
                    console.log('에러 상태:', error.response.status);
                    console.log('에러 메시지:', error.response.data);
                    
                    if (error.response.status === 202) {
                        // 전화번호 입력 필요
                        console.log('전화번호 입력이 필요합니다.');
                        const kakaoId = error.response.data.kakaoId;
                        const email = error.response.data.email;
                        const nickname = error.response.data.nickname;
                        
                        if (kakaoId) {
                            navigate('/phone-input', { 
                                state: { 
                                    kakaoId,
                                    email,
                                    nickname
                                } 
                            });
                        } else {
                            alert('카카오 ID를 받지 못했습니다.');
                            navigate('/');
                        }
                    } else {
                        alert('로그인 중 오류가 발생했습니다: ' + error.response.data);
                        navigate('/');
                    }
                } else {
                    alert('네트워크 오류가 발생했습니다.');
                    navigate('/');
                }
            });
        } else {
            console.error('인가 코드가 없습니다.');
            alert('카카오 로그인 인가 코드가 없습니다.');
            navigate('/');
        }
    }, [navigate]);

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