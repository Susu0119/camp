import React, { useState } from 'react';

export default function GeminiTest() {
    const [promptText, setPromptText] = useState("간단하게 AI가 어떻게 작동하는지 설명해줘"); // 사용자가 입력할 프롬프트
    const [apiResponse, setApiResponse] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Vite에서는 import.meta.env를 통해 환경 변수에 접근합니다.
    const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
    const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const handleApiCall = async () => {
        if (!promptText.trim()) {
            setError("질문을 입력해주세요.");
            return;
        }
        if (!GEMINI_API_KEY) {
            setError("API 키가 설정되지 않았습니다. .env 파일을 확인하세요.");
            console.error("API 키가 없습니다. .env 파일에 VITE_GEMINI_API_KEY를 설정해주세요.");
            return;
        }

        setIsLoading(true);
        setError(null);
        setApiResponse('');

        try {
            const response = await fetch(API_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    contents: [
                        {
                            parts: [
                                {
                                    text: promptText, // 상태에서 프롬프트 텍스트 사용
                                },
                            ],
                        },
                    ],
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                console.error('API Error Response:', errorData);
                throw new Error(`API 요청 실패: ${response.status} ${response.statusText}. ${errorData?.error?.message || ''}`);
            }

            const data = await response.json();

            if (data.candidates && data.candidates.length > 0 && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts.length > 0) {
                setApiResponse(data.candidates[0].content.parts[0].text);
            } else {
                // 예상치 못한 응답 구조 처리
                console.error('Unexpected API response structure:', data);
                setApiResponse('응답에서 텍스트를 찾을 수 없습니다. API 응답 구조를 확인하세요.');
            }

        } catch (err) {
            console.error(err);
            setError(err.message);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="App">
            <header className="App-header">
                <h1>Gemini API 테스트 (React + Vite)</h1>
                <div>
                    <textarea
                        value={promptText}
                        onChange={(e) => setPromptText(e.target.value)}
                        placeholder="AI에게 질문할 내용을 입력하세요..."
                        rows="3"
                        style={{ width: '80%', minHeight: '60px', padding: '10px', margin: '10px 0' }}
                    />
                </div>
                <button onClick={handleApiCall} disabled={isLoading}>
                    {isLoading ? '응답 받는 중...' : 'Gemini API 호출'}
                </button>
                {error && (
                    <div style={{ color: 'red', marginTop: '20px' }}>
                        <p><strong>오류 발생:</strong></p>
                        <pre>{error}</pre>
                    </div>
                )}
                {apiResponse && (
                    <div style={{ marginTop: '20px', textAlign: 'left', whiteSpace: 'pre-wrap', border: '1px solid #ccc', padding: '15px', background: '#f9f9f9' }}>
                        <p><strong>AI 응답:</strong></p>
                        <p>{apiResponse}</p>
                    </div>
                )}
            </header>
        </div>
    );
}