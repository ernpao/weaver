// App.tsx
import React from 'react';
import { Session } from '@toolpad/core/AppProvider';
import { DialogsProvider } from '@toolpad/core';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from './hooks/useAuth';

import { Components, CssBaseline, Theme, ThemeOptions, ThemeProvider, createTheme } from '@mui/material';
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";

import useProjectsStore from './hooks/store/useProjectsStore';

import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import LocationPinIcon from '@mui/icons-material/LocationPin';
import PublicIcon from '@mui/icons-material/Public';
import ScheduleIcon from '@mui/icons-material/Schedule';
import GestureIcon from '@mui/icons-material/Gesture';

import { HeroUIProvider } from "@heroui/react";


const BRANDING = {
  title: 'Weaver',
  // logo: <></>,
  logo: <GestureIcon color='primary' fontSize="large" />,
};


const componentStyles: Components<Omit<Theme, 'components'>> = {
  MuiCard: {
    styleOverrides: {
      root: {
        borderRadius: "1rem"
      }
    }
  },
  MuiDialog: {
    styleOverrides: {
      root: {
        "[role='dialog']": {
          borderRadius: "1rem"
        }
      }
    }
  },
  MuiButton: {
    styleOverrides: {
      root: {
        borderRadius: "0.625rem"
      }
    }
  },
}

export const themeOptions: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      main: '#9353d3',
      dark: '#6100ff',
    },
    secondary: {
      main: '#637aff',
    },
    divider: 'rgba(255,255,255,0.15)',
    background: {
      paper: '#282135',
      default: '#1b1526',
    },
    success: {
      main: '#23d98d',
    },
    warning: {
      main: '#ffca3a',
    },
    error: {
      main: '#ff6b6b',
    },
  },
  typography: {
    fontFamily: 'Lato',
  },

  components: componentStyles
};

const theme = createTheme(themeOptions);

// const theme = createTheme({
//   palette: {
//     // mode: 'dark',
//   },
// });

export default function App() {
  const { activeProject } = useProjectsStore()

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const signIn = React.useCallback(() => {
    navigate('/sign-in');
  }, [navigate]);

  const signOut = React.useCallback(async () => {
    await logout();
    navigate('/sign-in');
  }, [logout, navigate]);

  const session: Session | null = user
    ? {
      user: {
        id: user.uuid,
        name: user.username || user.email, // Fallback to email if no username
        email: user.email,
      },
    }
    : null

  return (

    <ReactRouterAppProvider
      navigation={
        activeProject ? [
          {
            segment: "",
            title: activeProject.name,
            // title: "Project Settings",
            icon: <DashboardIcon />
          },
          {
            kind: 'header',
            title: 'Worldbuilding'
          },

          {
            segment: "characters",
            title: "Characters",
            icon: <PeopleIcon color='primary' />
          },
          {
            segment: "places",
            title: "Places",
            icon: <LocationPinIcon color='primary' />
          },
          {
            segment: "timeline",
            title: "Timeline",
            icon: <ScheduleIcon color='primary' />
          }
        ] : []}
      branding={BRANDING}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <HeroUIProvider>
        <ThemeProvider theme={{ [MATERIAL_THEME_ID]: theme }}>
          <MaterialCssVarsProvider>
            <CssBaseline enableColorScheme />
            <DialogsProvider>
              <Outlet />
            </DialogsProvider>
          </MaterialCssVarsProvider>
        </ThemeProvider>
      </HeroUIProvider >
    </ReactRouterAppProvider>
  );
}
