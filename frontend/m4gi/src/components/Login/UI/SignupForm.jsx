"use client";
import { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth, apiCore } from '../../../utils/Auth.jsx';
import FormInput from '../../Common/FormInput';
import { Button } from '../../Common/Button';

export default function SignupForm() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth(); // Auth Context 사용
  
  // URL 파라미터나 state에서 kakaoId 가져오기
  const kakaoId = location.state?.kakaoId || new URLSearchParams(location.search).get('kakaoId');

  useEffect(() => {
    if (!kakaoId) {
      alert('카카오 로그인 정보가 없습니다. 다시 로그인해주세요.');
      navigate('/main');
    }
  }, [kakaoId, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 전화번호 형식 검증 (하이픈 있거나 없거나 모두 허용)
    const phoneRegex = /^01[0-9][-]?[0-9]{4}[-]?[0-9]{4}$/;
    
    console.log('입력한 전화번호:', phoneNumber);
    console.log('정규식 테스트 결과:', phoneRegex.test(phoneNumber));
    
    if (!phoneRegex.test(phoneNumber)) {
      setError('올바른 전화번호 형식이 아닙니다. (예: 010-1234-5678 또는 01012345678)');
      return;
    }
    
    setLoading(true);
    setError('');
    
    console.log('전화번호 업데이트 요청:', { kakaoId, phone: phoneNumber });
    
    try {
      const response = await apiCore.post('/oauth/kakao/update_phone', {
        kakaoId: kakaoId,
        phone: phoneNumber
      });
      
      console.log('응답:', response);
      
      if (response.status === 200 && response.data.user) {
        // 전화번호 업데이트 및 로그인 성공
        console.log('전화번호 업데이트 및 로그인 성공:', response.data.user);
        
        // Auth Context에 로그인 상태 설정
        login(response.data.user);
        
        alert('전화번호가 성공적으로 등록되었습니다. 로그인이 완료되었습니다.');
        navigate('/main'); // 메인 페이지로 이동
      } else {
        setError('전화번호 등록은 성공했지만 로그인 처리에 문제가 발생했습니다.');
      }
    } catch (error) {
      console.error('에러 발생:', error);
      if (error.response) {
        setError(error.response.data || '전화번호 등록 중 오류가 발생했습니다.');
      } else {
        setError('서버 연결에 실패했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full px-6">
      <div className="mx-auto" style={{ maxWidth: "420px" }}>
        <form
          onSubmit={handleSubmit}
          className="relative z-10 w-full px-6 py-8 rounded-2xl shadow-lg border border-white 
                    bg-[rgba(255,255,255,0.3)] backdrop-blur-md"
        >
          <h2 className="text-2xl font-bold leading-none text-center text-white">
            회원가입 / 소셜 중복 확인
          </h2>
          <p className="pt-4 text-sm leading-5 text-center text-white">
            전화번호를 입력하여 중복 회원가입을 <br />
            확인해 주세요
          </p>
          <div className="pt-2 w-full space-y-4">
            <FormInput 
              placeholder="전화번호" 
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
              type="tel"
            />
            
            {error && (
              <p className="text-red-500 text-sm text-center">{error}</p>
            )}

            <div className="flex overflow-hidden flex-col justify-center w-full font-bold text-center">
              <Button 
              className="w-full relative overflow-hidden bg-cpurple text-white font-semibold py-4 px-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98]"
              type="submit" disabled={loading}>
                {loading ? '처리 중...' : '회원가입 / 소셜 중복 확인'}
              </Button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};