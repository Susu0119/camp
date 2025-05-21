import { useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function KakaoCallback() {
  const navigate = useNavigate();

  useEffect(() => {
    const code = new URL(window.location.href).searchParams.get('code');
    console.log('카카오 인가 코드:', code); // 디버깅용

    if (code) {
      axios.post(
        'http://localhost:8080/web/oauth/kakao/callback',
        { code },
        {
          headers: {
            'Content-Type': 'application/json',
          },
          withCredentials: true,
        }
      )
        .then((res) => {
          console.log('응답:', res.data);
          if (res.data === '로그인 성공') {
            navigate('/');
          } else if (res.data === '전화번호 필요') {
            navigate('/signup');
          }
        })
        .catch((err) => {
          console.error('로그인 실패:', err);
        });
    }
  }, []);

  return <div>로그인 처리 중...</div>;
}
