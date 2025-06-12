import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../utils/Auth';

export default function TestLoginPage() {
    const [userId, setUserId] = useState('');
    const navigate = useNavigate();
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        
        try {
            const response = await fetch('/web/test-auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ providerUserId: userId })
            });

            const data = await response.json();
            
            if (response.ok) {
                console.log('테스트 로그인 성공:', data);
                login(data.user);
                navigate('/notification-test');
            } else {
                alert(data.message || '로그인 실패');
            }
        } catch (error) {
            console.error('로그인 에러:', error);
            alert('로그인 중 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{ 
            maxWidth: '400px', 
            margin: '40px auto', 
            padding: '20px',
            boxShadow: '0 0 10px rgba(0,0,0,0.1)',
            borderRadius: '8px'
        }}>
            <h1 style={{ textAlign: 'center', marginBottom: '20px' }}>테스트 로그인</h1>
            <form onSubmit={handleLogin}>
                <div style={{ marginBottom: '15px' }}>
                    <label style={{ display: 'block', marginBottom: '5px' }}>
                        테스트용 사용자 ID:
                    </label>
                    <input
                        type="text"
                        value={userId}
                        onChange={(e) => setUserId(e.target.value)}
                        style={{
                            width: '100%',
                            padding: '8px',
                            border: '1px solid #ddd',
                            borderRadius: '4px'
                        }}
                        placeholder="예: test_user_1"
                    />
                </div>
                <button
                    type="submit"
                    style={{
                        width: '100%',
                        padding: '10px',
                        backgroundColor: '#007bff',
                        color: 'white',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer'
                    }}
                >
                    로그인
                </button>
            </form>
        </div>
    );
} 