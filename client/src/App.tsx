// App.tsx
import React from 'react';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { useAuth, AuthProvider } from './hooks/useAuth';  // Correct import for the custom hook
import { createTheme } from '@mui/material';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ArticleIcon from '@mui/icons-material/Article';
import { NavigationSubheaderItem } from '@toolpad/core';


const navHeader: NavigationSubheaderItem = {
  kind: "header",
  title: 'Main items',
}

const NAVIGATION = [
  navHeader,
  {
    title: 'Dashboard',
    icon: <DashboardIcon />,
  },
  {
    segment: 'demo-page-1',
    title: 'Demo Page 1',
    icon: <ArticleIcon />,
  },
  {
    segment: 'demo-page-2',
    title: 'Demo Page 2',
    icon: <ArticleIcon />,
  },
];

const BRANDING = {
  title: 'Weaver',
};

const theme = createTheme({
  palette: {
    mode: 'dark',
  },
});

export default function App() {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(async () => {
    await logout();
    navigate('/sign-in');
  }, [logout, navigate]);

  return (
    <ReactRouterAppProvider
      navigation={NAVIGATION}
      branding={BRANDING}
      session={
        user
          ? {
            user: {
              name: user.username || user.email, // Fallback to email if no username
              email: user.email,
            },
          }
          : null
      }
      authentication={{ signIn, signOut }}
      theme={theme}
    >
      <Outlet />
    </ReactRouterAppProvider>
  );
}
