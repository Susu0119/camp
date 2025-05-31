import React, { createContext, useContext, useState, useEffect } from 'react';

// 인증 컨텍스트 생성
const AuthContext = createContext(null);

// AuthProvider 컴포넌트 - 앱 전체에 인증 상태 제공
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // 컴포넌트 마운트 시 로컬 스토리지에서 사용자 정보 로드
  useEffect(() => {
    const storedUser = getUserInfo();
    const token = getToken();
    
    if (token && storedUser) {
      setUser(storedUser);
      setIsAuthenticated(true);
    }
  }, []);
  
  // 토큰 저장
  const setToken = (token) => {
    localStorage.setItem('auth_token', token);
  };

  // 토큰 가져오기
  const getToken = () => {
    return localStorage.getItem('auth_token');
  };

  // 토큰 삭제 (로그아웃 시)
  const removeToken = () => {
    localStorage.removeItem('auth_token');
  };

  // 사용자 정보 저장
  const setUserInfo = (userData) => {
    localStorage.setItem('user_info', JSON.stringify(userData));
    setUser(userData);
    setIsAuthenticated(true);
  };

  // 사용자 정보 가져오기
  const getUserInfo = () => {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  };

  // 사용자 정보 삭제
  const removeUserInfo = () => {
    localStorage.removeItem('user_info');
    setUser(null);
    setIsAuthenticated(false);
  };

  // 로그인 여부 확인
  const isLoggedIn = () => {
    return !!getToken();
  };

  // 로그아웃 처리
  const logout = () => {
    removeToken();
    removeUserInfo();
  };
  
  // 컨텍스트 값
  const authContextValue = {
    user,
    isAuthenticated,
    setToken,
    getToken,
    setUserInfo,
    getUserInfo,
    logout,
    isLoggedIn
  };
  
  return (
    <AuthContext.Provider value={authContextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// 인증 컨텍스트 사용을 위한 커스텀 훅
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// 직접 함수 호출을 위한 export (컨텍스트 없이 사용 가능)
export const Auth = {
  setToken: (token) => localStorage.setItem('auth_token', token),
  getToken: () => localStorage.getItem('auth_token'),
  removeToken: () => localStorage.removeItem('auth_token'),
  setUserInfo: (user) => localStorage.setItem('user_info', JSON.stringify(user)),
  getUserInfo: () => {
    const userInfo = localStorage.getItem('user_info');
    return userInfo ? JSON.parse(userInfo) : null;
  },
  removeUserInfo: () => localStorage.removeItem('user_info'),
  isLoggedIn: () => !!localStorage.getItem('auth_token'),
  logout: () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user_info');
  }
};
