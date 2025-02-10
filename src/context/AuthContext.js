import React, { createContext, useState, useContext, useEffect } from 'react';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if user is logged in on mount
        const currentUser = authService.getCurrentUser();
        setUser(currentUser);
        setLoading(false);
    }, []);

    const signup = async (userData) => {
        try {
            const newUser = await authService.signup(userData);
            setUser(newUser);
            return newUser;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const loggedInUser = await authService.login(email, password);
            setUser(loggedInUser);
            return loggedInUser;
        } catch (error) {
            throw error;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signup,
            login,
            logout,
            isLoggedIn: !!user
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
