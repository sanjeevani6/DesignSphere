// src/context/UserContext.js

import React, { createContext, useState } from 'react';

// Create a UserContext
export const UserContext = createContext();

// Create a provider component
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

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
