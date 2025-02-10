import React, { createContext, useState, useContext, useEffect } from 'react';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import { authService } from '../services/authService';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const auth = getAuth();
        // Subscribe to auth state changes
        const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
            if (firebaseUser) {
                setUser({
                    id: firebaseUser.uid,
                    name: firebaseUser.displayName,
                    email: firebaseUser.email,
                    phone: firebaseUser.phoneNumber,
                    createdAt: firebaseUser.metadata.creationTime
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        // Cleanup subscription
        return () => unsubscribe();
    }, []);

    const signup = async (userData) => {
        try {
            const newUser = await authService.signup(userData);
            return newUser;
        } catch (error) {
            throw error;
        }
    };

    const login = async (email, password) => {
        try {
            const loggedInUser = await authService.login(email, password);
            return loggedInUser;
        } catch (error) {
            throw error;
        }
    };

    const signInWithGoogle = async () => {
        try {
            const user = await authService.signInWithGoogle();
            return user;
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
        } catch (error) {
            throw error;
        }
    };

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            signup,
            login,
            signInWithGoogle,
            logout,
            isLoggedIn: !!user
        }}>
            {!loading && children}
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
