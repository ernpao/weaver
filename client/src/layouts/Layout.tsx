import { Outlet, Navigate, useLocation } from 'react-router';
import { DashboardLayout } from '@toolpad/core/DashboardLayout';
import { Box } from '@mui/material';
import { useAuth } from '../hooks/useAuth'; // Assuming useAuth is in hooks/

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
        <DashboardLayout>
            <Box sx={{ padding: 1 }}>
                <Outlet />
            </Box>
        </DashboardLayout>
    );
}
