// hooks/useAuth.tsx
import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';


const API_SERVER = process.env.REACT_APP_API_SERVER_URL;

export interface AuthenticatedUser {
    uuid: string;
    email: string;
    username: string;
}

interface AuthProfileCheckResponse {
    success: boolean;
    error?: any;
    user?: AuthenticatedUser;
}

// Define the type of context value
interface AuthContextProps {
    user: AuthenticatedUser | null;
    isAuthenticated: boolean;
    loading: boolean;
    login: (email: string, password: string, remember: boolean) => Promise<boolean>;
    logout: () => Promise<void>;
}

// Create the context
export const AuthContext = createContext<AuthContextProps | undefined>(undefined);

// Custom hook to use the AuthContext
export const useAuth = (): AuthContextProps => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};

// Provider component to wrap around the app
export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<AuthenticatedUser | null>(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        setLoading(true);
        try {
            const res = await fetch(`${API_SERVER}/auth/profile`, {
                credentials: 'include',
            });

            if (res.ok) {
                const data: AuthProfileCheckResponse = await res.json();

                if (data.success && data.user) {
                    setUser(data.user);
                    setIsAuthenticated(true);
                } else {
                    setUser(null);
                    setIsAuthenticated(false);
                }
            } else {
                setUser(null);
                setIsAuthenticated(false);
            }
        } catch (error) {
            setUser(null);
            setIsAuthenticated(false);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => { fetchUser(); }, []);

    const login = async (email: string, password: string, remember: boolean = false) => {
        const res = await fetch(`${API_SERVER}/auth/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({ email, password, remember }),
        });

        if (res.ok) {
            await fetchUser();
            return true;
        } else {
            return false;
        }
    };

    const logout = async () => {
        await fetch(`${API_SERVER}/auth/logout`, {
            method: 'POST',
            credentials: 'include',
        });

        setUser(null);
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
