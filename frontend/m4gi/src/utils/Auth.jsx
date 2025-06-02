import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

// 공통 Axios 인스턴스 생성
export const apiClient = axios.create({
    baseURL: '/web', // 서버 주소
    withCredentials: true, 
});

// 토큰 관리 함수
const getTokenFromStorage = () => localStorage.getItem('auth_token');
const setTokenToStorage = (token) => {
    if (token) {
        localStorage.setItem('auth_token', token);
        apiClient.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
        localStorage.removeItem('auth_token');
        delete apiClient.defaults.headers.common['Authorization'];
    }
};
const removeTokenFromStorage = () => {
    localStorage.removeItem('auth_token');
    delete apiClient.defaults.headers.common['Authorization'];
};

// 사용자 정보 관리 함수
const getUserInfoFromStorage = () => {
    const userInfoString = localStorage.getItem('user_info');
    return userInfoString ? JSON.parse(userInfoString) : null;
};
const setUserInfoToStorage = (userData) => {
    if (userData) {
        localStorage.setItem('user_info', JSON.stringify(userData));
    } else {
        localStorage.removeItem('user_info');
    }
};
const removeUserInfoFromStorage = () => {
    localStorage.removeItem('user_info');
};

// 인터셉터에서 사용할 간단한 로그아웃 함수
const performSimpleLogout = () => {
    console.log('인터셉터에서 간단한 로그아웃 실행');
    removeTokenFromStorage();
    removeUserInfoFromStorage();
    window.location.href = '/login';
};

// 요청 인터셉터 - 헤더에 토큰 추가
apiClient.interceptors.request.use(
    (config) => {
        console.log('요청 인터셉터:', config.url);
        const token = getTokenFromStorage();
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
            // 디버깅용 로그 - 토큰의 첫 10자만 표시 (보안상 전체 토큰 로깅 금지)
            if (process.env.NODE_ENV === 'development') {
                console.log(`토큰 헤더 추가됨: ${token.substring(0, 10)}...`);
            }
        } else {
            console.log('토큰 없음, Authorization 헤더 추가되지 않음');
        }
        return config;
    },
    (error) => {
        console.error('요청 인터셉터 오류:', error);
        return Promise.reject(error);
    }
);

// 응답 인터셉터 - 401 오류 발생 시 토큰 재발급
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        console.log('응답 인터셉터 에러 감지:', error.config?.url, error.response?.status);
        
        // 원래 요청 설정 저장
        const originalRequest = error.config;
        
        // 요청 설정이 없거나 URL이 없는 경우 처리 불가
        if (!originalRequest || !originalRequest.url) {
            console.error('요청 설정 또는 URL이 없음, 인터셉터 처리 불가');
            return Promise.reject(error);
        }
        
        // 이미 토큰 갱신 시도한 요청인지 확인 (무한 루프 방지)
        if (originalRequest._retry) {
            console.warn('이미 토큰 갱신 시도한 요청임');
            return Promise.reject(error);
        }
        
        // 401 오류이고 리프레시 토큰 요청이 아닌 경우에만 토큰 갱신 시도
        if (error.response?.status === 401 && !originalRequest.url.includes('/refresh_token')) {
            console.log('401 오류 감지, 토큰 갱신 시도');
            originalRequest._retry = true;
            
            try {
                // 리프레시 토큰으로 새 액세스 토큰 요청
                const refreshResponse = await apiClient.post('/oauth/kakao/refresh_token');
                console.log('리프레시 토큰 응답:', refreshResponse.data);
                
                if (refreshResponse.data && refreshResponse.data.accessToken) {
                    // 새 토큰 저장 및 헤더 업데이트
                    const newToken = refreshResponse.data.accessToken;
                    setTokenToStorage(newToken);
                    
                    // 원래 요청 헤더 업데이트
                    originalRequest.headers['Authorization'] = `Bearer ${newToken}`;
                    
                    // 원래 요청 재시도
                    console.log('새 토큰으로 원래 요청 재시도:', originalRequest.url);
                    return apiClient(originalRequest);
                } else {
                    console.warn('리프레시 토큰 응답에 accessToken 없음');
                    // 여기서는 직접 performSimpleLogout 호출
                    performSimpleLogout();
                    return Promise.reject(error);
                }
            } catch (refreshError) {
                console.error('리프레시 토큰 요청 실패:', refreshError);
                // 여기서는 직접 performSimpleLogout 호출
                performSimpleLogout();
                return Promise.reject(refreshError);
            }
        }
        
        // 다른 오류는 그대로 반환
        return Promise.reject(error);
    }
);

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// AuthProvider 컴포넌트 - 인증 상태 관리 및 Context 제공
export function AuthProvider({ children }) {
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // 로딩 상태 추가 (이름 명확하게 변경)

    // 서버에 토큰 유효성을 확인하는 함수 - 앱 시작 시 호출됨
    const checkServerLoginStatus = async () => {
        try {
            console.log('서버에 로그인 상태 확인 요청');
            const response = await apiClient.post('/oauth/kakao/status');
            console.log('토큰 유효함');
            
            // 서버에서 받은 최신 사용자 정보로 상태 업데이트
            if (response.data && response.data.user) {
                setUser(response.data.user);
                setIsAuthenticated(true);
                console.log('서버에서 받은 최신 사용자 정보로 상태 업데이트됨');
            }
            return true;
        } catch (error) {
            console.error('토큰 유효성 확인 실패:', error);
            // 다른 오류의 경우 여기서 추가 처리
            if (error.response && error.response.status === 401) {
                setIsAuthenticated(false);
                setUser(null);
            }
            return false;
        }
    };

    // 컴포넌트 마운트 시 로컬 스토리지 확인 및 서버 상태 확인
    useEffect(() => {
        const checkAuth = async () => {
            setIsLoading(true); // 로딩 시작
            const token = getTokenFromStorage();
            const userInfo = getUserInfoFromStorage();

            if (token && userInfo) {
                try {
                    // 서버에 토큰 유효성 확인 요청
                    const isValid = await checkServerLoginStatus();
                    
                    if (isValid) {
                        setIsAuthenticated(true);
                        setUser(userInfo);
                    } else {
                        // 토큰이 유효하지 않으면 로컬 스토리지 정리
                        removeTokenFromStorage();
                        removeUserInfoFromStorage();
                        setIsAuthenticated(false);
                        setUser(null);
                    }
                } catch (error) {
                    console.error('토큰 검증 중 오류:', error);
                    // 오류 발생 시 로그아웃 처리
                    removeTokenFromStorage();
                    removeUserInfoFromStorage();
                    setIsAuthenticated(false);
                    setUser(null);
                }
            } else {
                setIsAuthenticated(false);
                setUser(null);
            }
            setIsLoading(false); // 로딩 완료
        };

        checkAuth();
    }, []);

    // 로그인 처리 - 토큰 저장 및 상태 업데이트
    const login = useCallback((token, userData) => {
        console.log('AuthProvider.login 호출됨');
        setTokenToStorage(token); // 토큰 저장 및 apiClient 헤더 설정
        setUserInfoToStorage(userData); // 사용자 정보 저장
        
        setIsAuthenticated(true); // React 상태 업데이트
        setUser(userData);
    }, []);

    // 로그아웃 처리 - 토큰 제거 및 상태 업데이트
    const logout = useCallback(async () => {
        console.log('AuthProvider.logout 호출됨');
        try {
            // 서버 로그아웃 API 호출
            const token = getTokenFromStorage();
            if (token) {
                try {
                    await apiClient.post('/oauth/kakao/logout');
                    console.log('서버 로그아웃 API 호출 성공');
                } catch (serverError) {
                    console.error('서버 로그아웃 API 오류:', serverError);
                    // 서버 호출 실패해도 로컬 정리는 계속 진행
                }
            }
            
            // 로컬 스토리지 정리
            removeTokenFromStorage();
            removeUserInfoFromStorage();
            
            // React 상태 업데이트
            setIsAuthenticated(false);
            setUser(null);
            
            // 카카오 로그아웃 리디렉션
            try {
                const clientId = import.meta.env.VITE_KAKAO_REST_KEY;
                const logoutRedirectURI = "http://localhost:5173/login";
                
                if (clientId) {
                    // 카카오 로그아웃 URL - 개발자 콘솔에 등록된 URI와 정확히 일치해야 함
                    window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${logoutRedirectURI}`;
                } else {
                    console.warn("Auth.logout: Kakao Client ID 없음. 일반 로그아웃 처리.");
                    window.location.href = logoutRedirectURI;
                }
            } catch (e) {
                console.error("Auth.logout: 카카오 로그아웃 URL 생성 중 오류", e);
                window.location.href = "/login"; // 오류 발생 시 안전하게 로그인 페이지로
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
    // 토큰 관리 함수
    setToken: (token) => {
        setTokenToStorage(token);
        console.warn("Auth.setToken 직접 호출됨. React 상태(isAuthenticated, user)는 AuthProvider의 login 함수를 통해 관리하는 것이 가장 좋습니다.");
    },
    getToken: () => getTokenFromStorage(),
    removeToken: () => removeTokenFromStorage(),
    
    // 사용자 정보 관리 함수
    setUserInfo: (userData) => {
        setUserInfoToStorage(userData);
        console.warn("Auth.setUserInfo 직접 호출됨. React 상태(isAuthenticated, user)는 AuthProvider의 login 함수를 통해 관리하는 것이 가장 좋습니다.");
    },
    getUserInfo: () => getUserInfoFromStorage(),
    removeUserInfo: () => removeUserInfoFromStorage(),
    
    // 로그인 상태 확인 함수
    isLoggedIn: () => !!getTokenFromStorage(), // 단순 로컬스토리지 확인
    
    // 인터셉터에서 사용하는 간단한 로그아웃 함수
    simpleLogout: () => performSimpleLogout(),

    // 서버 토큰 유효성 확인 - Auth 객체로도 사용 가능
    checkServerLoginStatus: async () => {
        try {
            console.log('서버에 로그인 상태 확인 요청 (Auth.checkServerLoginStatus)');
            const response = await apiClient.post('/oauth/kakao/status');
            console.log('토큰 유효함:', response.data);
            return true;
        } catch (error) {
            console.error('토큰 유효성 확인 실패:', error);
            if (error.response && error.response.status === 401) {
                performSimpleLogout();
            }
            return false;
        }
    },

    // 전체 로그아웃 처리 함수
    logout: async () => {
        const token = getTokenFromStorage();

        if (token) {
            try {
                // apiClient를 사용하여 서버 로그아웃 (리프레시 토큰 쿠키도 서버에서 처리)
                await apiClient.post('/oauth/kakao/logout');
                console.log('Auth.logout: 서버 로그아웃 API 호출 성공');
            } catch (serverError) {
                console.error('Auth.logout: 서버 로그아웃 API 오류:', serverError);
                // 서버 호출 실패해도 로컬 정리 및 카카오 로그아웃은 계속 진행
            }
        }
        removeTokenFromStorage();    // 로컬 스토리지 'auth_token' 삭제 및 apiClient 헤더 정리
        removeUserInfoFromStorage(); // 로컬 스토리지 'user_info' 삭제

        // 카카오 로그아웃 리디렉션
        try {
            const clientId = import.meta.env.VITE_KAKAO_REST_KEY;
            // 환경변수에서 로그아웃 리디렉션 URI 가져오기 (없으면 기본값 사용)
            const logoutRedirectURI = import.meta.env.VITE_KAKAO_LOGOUT_REDIRECT_URI || "http://localhost:5173/login";
            
            if (clientId) {
                // 카카오 로그아웃 URL - 개발자 콘솔에 등록된 URI와 정확히 일치해야 함
                window.location.href = `https://kauth.kakao.com/oauth/logout?client_id=${clientId}&logout_redirect_uri=${logoutRedirectURI}`;
            } else {
                console.warn("Auth.logout: Kakao Client ID 없음. 일반 로그아웃 처리.");
                window.location.href = logoutRedirectURI;
            }
        } catch (e) {
            console.error("Auth.logout: 카카오 로그아웃 URL 생성 중 오류", e);
            window.location.href = "/login"; // 오류 발생 시 안전하게 로그인 페이지로
        }
    }
};
