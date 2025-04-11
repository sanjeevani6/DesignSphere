// src/context/UserContext.js

import React, { createContext, useState, useEffect } from 'react';

// Create a UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    useEffect(() => {
        // Check local storage or make an API call to set currentUser
        const user = JSON.parse(localStorage.getItem('user')); // Assuming you store user info in localStorage
        if (user) {
            setCurrentUser(user);
        }
    }, []);

    const login = (user) => {
        setCurrentUser(user); // Set user object after successful login
    };

    const logout = () => {
        setCurrentUser(null); // Clear user on logout
    };

    
    return (
        <UserContext.Provider value={{ currentUser, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};
