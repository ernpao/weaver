import { Box, useTheme } from "@mui/material";
import { AuthProvider, AuthResponse, SignInPage } from "@toolpad/core";
import { Navigate, useNavigate, useLocation } from "react-router";
import { useAuth } from "../hooks/useAuth"; // Use your useAuth hook

export default function SignIn() {
    const { isAuthenticated, login } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    if (isAuthenticated) {
        const callbackUrl = new URLSearchParams(location.search).get('callbackUrl') || '/';
        return <Navigate to={callbackUrl} replace />;
    }

    const signIn = async (provider: AuthProvider, formData: FormData): Promise<AuthResponse> => {
        let success: string | undefined = "Login successful.";
        let error: string | undefined;
        let type: string | undefined;

        try {
            const email = formData.get('email') as string;
            const password = formData.get('password') as string;
            const remember = formData.get('remember') === 'on';

            const result = await login(email, password, remember);

            if (result) {

                const callbackUrl = new URLSearchParams(location.search).get('callbackUrl') || '/';
                navigate(callbackUrl, { replace: true });

            } else {
                throw new Error("Invalid email or password");
            }

        } catch (e) {
            success = undefined;
            error = (e as Error).message;
            type = (e as Error).name;
        } finally {
            const response: AuthResponse = { success, error, type };
            return response;
        }
    }

    return (
        <Box>
            <SignInPage
                signIn={signIn}
                providers={[{ id: 'credentials', name: 'Credentials' }]}
                slotProps={{ emailField: { autoFocus: false }, form: { noValidate: true } }}
            />
        </Box>
    );
}
