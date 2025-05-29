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

  return (
    <div className="absolute top-full right-0 mt-2 z-50">
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
          <ListItemButton>
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