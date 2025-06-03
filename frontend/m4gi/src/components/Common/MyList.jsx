import * as React from 'react';
import ListSubheader from '@mui/material/ListSubheader';
import List from '@mui/material/List';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import SupportAgentIcon from '@mui/icons-material/SupportAgent';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import LogoutIcon from '@mui/icons-material/Logout';
import DateRangeIcon from '@mui/icons-material/DateRange';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Logo from './Logo';
import { Divider } from '@mui/material';
import { useAuth } from '../../utils/Auth.jsx'; // Auth 객체 대신 useAuth 훅 사용

export default function MyList() {
  // MUI 테마를 커스터마이징하여 폰트 패밀리 변경
  const theme = createTheme({
    typography: {
      fontFamily: 'LINESeedKR-Bd, sans-serif',
    },
    components: {
      MuiListItemText: {
        styleOverrides: {
          primary: {
            fontFamily: 'LINESeedKR-Bd, sans-serif',
          },
        },
      },
      MuiListSubheader: {
        styleOverrides: {
          root: {
            fontFamily: 'LINESeedKR-Bd, sans-serif',
            padding: '8px 0',
            backgroundColor: 'transparent',
          },
        },
      },
    },
  });

  // useAuth 훅을 사용하여 로그아웃 기능 가져오기
  const { logout } = useAuth();
  
  // 로그아웃 핸들러
  const handleLogout = async (e) => {
    // 이벤트 버블링 방지 - 중요!
    e.stopPropagation();
    console.log('MyList handleLogout clicked');
    try {
      // useAuth에서 가져온 logout 함수 사용
      await logout();
      // logout 함수가 리디렉션을 처리하므로 추가 작업 필요 없음
    } catch (error) {
      console.error('로그아웃 처리 중 오류:', error);
      window.location.reload(); // 오류 발생 시 페이지 새로고침
    }
  };

  return (
    <div className="absolute top-full right-0 mt-2 z-50" onClick={(e) => e.stopPropagation()}>
      <ThemeProvider theme={theme}>
        <List
          sx={{ 
            width: '100%', 
            maxWidth: 280, 
            bgcolor: 'white',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 24px rgba(0, 0, 0, 0.15)',
            overflow: 'hidden',
            '& .MuiListItemText-primary': {
              fontFamily: 'LINESeedKR-Bd, sans-serif',
            },
            '& .MuiListSubheader-root': {
              fontFamily: 'LINESeedKR-Bd, sans-serif',
              backgroundColor: 'transparent',
            }
          }}
          component="nav"
          aria-labelledby="nested-list-subheader"
          subheader={
            <>
            <ListSubheader component="div" id="nested-list-subheader" disableSticky>
              <Logo variant="small"/>
            </ListSubheader>
            <Divider/>
            </>
          }
        >
          <ListItemButton>
            <ListItemIcon>
              <AccountCircleIcon />
            </ListItemIcon>
            <ListItemText primary="마이페이지" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <SupportAgentIcon />
            </ListItemIcon>
            <ListItemText primary="고객센터" />
          </ListItemButton>
          <ListItemButton>
            <ListItemIcon>
              <DateRangeIcon />
            </ListItemIcon>
            <ListItemText primary="나의 예약" />
          </ListItemButton>
          <Divider/>
          <ListItemButton onClick={handleLogout}>
            <ListItemIcon>
              <LogoutIcon />
            </ListItemIcon>
            <ListItemText primary="로그아웃" />
          </ListItemButton>
        </List>
      </ThemeProvider>
    </div>
  );
}