import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 기본 axios 설정에 세션 쿠키 포함
axios.defaults.withCredentials = true;

// 공통 Axios 인스턴스 생성
export const apiCore = axios.create({
    baseURL: '/web', // 서버 주소
    withCredentials: true, // 세션 쿠키 포함
});

// 인터셉터에서 사용할 간단한 로그아웃 함수
const performSimpleLogout = () => {
    console.log('인터셉터에서 간단한 로그아웃 실행');
    window.location.href = '/login';
};

// 요청 인터셉터 - 세션 쿠키는 withCredentials로 자동 포함됨
apiCore.interceptors.request.use(
    (config) => {
        console.log('요청 인터셉터:', config.url);
        return config;
    },
    (error) => {
        console.error('요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 401 오류 발생 시 로그아웃 처리
apiCore.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log('응답 인터셉터 에러 감지:', error.config?.url, error.response?.status);
        
        // 401 오류 발생 시 세션 만료로 간주하고 로그아웃 처리
        if (error.response?.status === 401) {
            console.log('401 오류 감지, 세션 만료로 간주');
            performSimpleLogout();
        }
        
        return Promise.reject(error);
    }
);

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// AuthProvider 컴포넌트 - 인증 상태 관리 및 Context 제공
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    // 서버에 세션 유효성을 확인하는 함수 - 앱 시작 시 호출됨
    const checkServerLoginStatus = async () => {
        try {
            console.log('서버에 로그인 상태 확인 요청');
            const response = await apiCore.post('/oauth/kakao/status');
            console.log('세션 유효함');
            
            // 서버에서 받은 최신 사용자 정보로 상태 업데이트
            if (response.data && response.data.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                console.log('서버에서 받은 최신 사용자 정보로 상태 업데이트됨');
            }
            return true;
        } catch (error) {
            console.error('세션 유효성 확인 실패:', error);
            if (error.response && error.response.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
            }
            return false;
        }
    };

    // 컴포넌트 마운트 시 서버 세션 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true);
            
            try {
                // 서버에 세션 유효성 확인 요청
                const isValid = await checkServerLoginStatus();
                
                if (isValid) {
                    setIsAuthenticated(true);
                    // user 정보는 checkServerLoginStatus에서 설정됨
                } else {
                    // 세션이 유효하지 않으면 상태 초기화
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } catch (error) {
                console.error('세션 검증 중 오류:', error);
                // 오류 발생 시 로그아웃 처리
                setIsAuthenticated(false);
                setUser(null);
            }
            
            setIsLoading(false);
        };

        checkAuth();
    }, []);

    // 로그인 처리 - React 상태만 업데이트 (세션은 서버에서 관리)
    const login = useCallback((userData) => {
        console.log('AuthProvider.login 호출됨');
        setIsAuthenticated(true);
        setUser(userData);
    }, []);

    // 로그아웃 처리 - 세션 제거 및 상태 업데이트
    const logout = useCallback(async () => {
        console.log('AuthProvider.logout 호출됨');
        try {
            // React 상태 먼저 업데이트 (UI 반응성을 위해)
            setIsAuthenticated(false);
            setUser(null);

            // 서버 로그아웃 API 호출 (세션 삭제)
            try {
                await apiCore.post('/oauth/kakao/logout');
                console.log('서버 로그아웃 API 호출 성공 - 세션 및 쿠키 제거됨');
            } catch (serverError) {
                console.error('서버 로그아웃 API 오류:', serverError);
                // 서버 호출 실패해도 카카오 로그아웃은 계속 진행
            }
            
            // 카카오 로그아웃 리디렉션
            try {
                const clientId = import.meta.env.VITE_KAKAO_REST_KEY;
                const logoutRedirectURI = "http://localhost:5173/login";
                
                if (clientId) {
                    // 카카오 로그아웃 URL - 개발자 콘솔에 등록된 URI와 정확히 일치해야 함
                    console.log('카카오 로그아웃 페이지로 리디렉션');
                    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${logoutRedirectURI}`;
                } else {
                    console.warn("Auth.logout: Kakao Client ID 없음. 일반 로그아웃 처리.");
                    window.location.href = logoutRedirectURI;
                }
            } catch (e) {
                console.error("Auth.logout: 카카오 로그아웃 URL 생성 중 오류", e);
                window.location.href = "/login";
            }
        } catch (error) {
            console.error('로그아웃 중 오류:', error);
            // 오류가 발생해도 로컬 상태는 정리
            setIsAuthenticated(false);
            setUser(null);
            window.location.href = "/login";
        }
    }, []);

    const authContextValue = {
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        checkServerLoginStatus
    };

    return (
        <AuthContext.Provider value={authContextValue}>
            {children}
        </AuthContext.Provider>
    );
}

// useAuth 훅 - 컴포넌트에서 인증 컨텍스트 사용하기 위한 훅
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth는 AuthProvider 내부에서 사용해야 합니다.');
    }
    return context;
};

// 직접 함수 호출을 위한 Auth 객체 export (기존 방식 유지를 위함)
export const Auth = {
    // 로그인 상태 확인 함수 - 세션 기반에서는 서버 확인 필요
    isLoggedIn: async () => {
        try {
            const response = await apiCore.post('/oauth/kakao/status');
            return response.status === 200;
        } catch (error) {
            return false;
        }
    },
    
    // 인터셉터에서 사용하는 간단한 로그아웃 함수
    simpleLogout: () => performSimpleLogout(),

    // 서버 세션 유효성 확인
    checkServerLoginStatus: async () => {
        try {
            console.log('서버에 로그인 상태 확인 요청 (Auth.checkServerLoginStatus)');
            const response = await apiCore.post('/oauth/kakao/status');
            console.log('세션 유효함:', response.data);
            return true;
        } catch (error) {
            console.error('세션 유효성 확인 실패:', error);
            if (error.response && error.response.status === 401) {
                performSimpleLogout();
            }
            return false;
        }
    },

    // 전체 로그아웃 처리 함수
    logout: async () => {
        console.log('Auth.logout 호출됨');
        try {
            // 서버 로그아웃 API 호출 (세션 삭제)
            await apiCore.post('/oauth/kakao/logout');
            console.log('Auth.logout: 서버 로그아웃 API 호출 성공 - 세션 및 쿠키 제거됨');
        } catch (serverError) {
            console.error('Auth.logout: 서버 로그아웃 API 오류:', serverError);
            // 서버 호출 실패해도 카카오 로그아웃은 계속 진행
        }
        
        // 카카오 로그아웃 리디렉션
        try {
            const clientId = import.meta.env.VITE_KAKAO_REST_KEY;
            const logoutRedirectURI = "http://localhost:5173/login";
            
            if (clientId) {
                // 카카오 로그아웃 URL - 개발자 콘솔에 등록된 URI와 정확히 일치해야 함
                console.log('카카오 로그아웃 페이지로 리디렉션');
                window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${logoutRedirectURI}`;
            } else {
                console.warn("Auth.logout: Kakao Client ID 없음. 일반 로그아웃 처리.");
                window.location.href = logoutRedirectURI;
            }
        } catch (e) {
            console.error("Auth.logout: 카카오 로그아웃 URL 생성 중 오류", e);
            window.location.href = "/login";
        }
    }
};
