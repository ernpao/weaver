import { useState } from 'react';
import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { useAuth } from '../hooks/useAuth';
import { Box, Stack } from '@mui/joy';
import Paper from '@mui/material/Paper';
import ProjectSelector from '../components/ProjectSelector';
import { SignOutButton } from '@toolpad/core';

export default function Layout() {


    const { isAuthenticated, loading } = useAuth();
    const location = useLocation();

    if (loading) {
        return <div></div>; // Or a spinner if you want
    }

    if (!isAuthenticated) {
        const redirectTo = `/sign-in?callbackUrl=${encodeURIComponent(location.pathname)}`;
        return <Navigate to={redirectTo} replace />;
    }

    return (
        <DashboardLayout
            slots={{
                toolbarActions: CustomToolbarActions,
                toolbarAccount: () => (<></>),
                sidebarFooter: (props) => (
                    props.mini ?
                        (<></>) :
                        (<Stack sx={{
                            display: props.mini ? "none" : "flex",
                            flexGrow: "1",
                            justifyContent: "flex-end",
                        }}>

                            <SignOutButton variant='contained' sx={{ m: 2 }} />
                        </Stack>)
                )
            }}
        >
            <Box padding={2} height={"100%"}>
                <Outlet />
            </Box>
        </DashboardLayout>
    );
}

function CustomToolbarActions() {
    return (
        <Stack
            className="custom-toolbar-actions"
            direction={'row'}
            sx={{
                width: 'calc(100vw - 320px)',
                mx: "auto",
                flexGrow: 1,
                justifyContent: 'space-between',
            }}
        >
            <ProjectSelector />
        </Stack>
    )
}

