// App.tsx
import React from 'react';
import { Session } from '@toolpad/core/AppProvider';
import { DialogsProvider } from '@toolpad/core';
import { ReactRouterAppProvider } from '@toolpad/core/react-router';
import { Outlet, useNavigate } from 'react-router';
import { useAuth } from './hooks/useAuth';  // Correct import for the custom hook
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { CssVarsProvider as JoyCssVarsProvider } from "@mui/joy/styles";
import {
  Experimental_CssVarsProvider as MaterialCssVarsProvider,
  THEME_ID as MATERIAL_THEME_ID,
} from "@mui/material/styles";
import useProjectsStore from './hooks/store/useProjectsStore';


const BRANDING = {
  title: 'Weaver',
  // logo: <></>,
};

const theme = createTheme({
  palette: {
    // mode: 'dark',
  },
});



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
      navigation={activeProject ? [

        {
          segment: "characters",
          title: "Characters",
        },
        {
          segment: "places",
          title: "Places"
        },
        {
          segment: "events",
          title: "Events"
        }
      ] : []}
      branding={BRANDING}
      session={session}
      authentication={{ signIn, signOut }}
    >
      <ThemeProvider theme={{ [MATERIAL_THEME_ID]: theme }}>
        <MaterialCssVarsProvider>
          <JoyCssVarsProvider>
            <CssBaseline enableColorScheme />
            <DialogsProvider>
              <Outlet />
            </DialogsProvider>
          </JoyCssVarsProvider>
        </MaterialCssVarsProvider>
      </ThemeProvider>
    </ReactRouterAppProvider>
  );
}
