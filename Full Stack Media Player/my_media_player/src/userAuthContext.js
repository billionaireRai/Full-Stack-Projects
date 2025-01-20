import React, { createContext, useContext, useState} from "react";

const authContext = createContext();

// Function to trigger authContext...
export const useAuth = () => {
    return useContext(authContext);
}

// Create the authProvider component...
export const AuthProvider = ({ children }) => {
    const [isAuthenticated, setIsAuthenticated] = useState(() => {
        return localStorage.getItem('isAuthenticated') === 'true'; // Check localStorage for authentication status on initial load
    });

    const signup = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); // Persist state
    }
    const login = () => {
        setIsAuthenticated(true);
        localStorage.setItem('isAuthenticated', 'true'); // Persist state
    }
    const logout = () => {
        setIsAuthenticated(false);
        localStorage.removeItem('isAuthenticated'); // Remove from storage
    }

    return (
        <authContext.Provider value={{ isAuthenticated, login, logout, signup }}>
            {children}
        </authContext.Provider>
    );
}