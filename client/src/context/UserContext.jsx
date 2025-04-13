// src/context/UserContext.js

import React, { createContext, useState, useEffect, useContext } from 'react';
import axiosInstance from '../services/axiosInstance';


// Create a UserContext
export const UserContext = createContext();
export const useUser = () => useContext(UserContext);

// Create a provider component
export const UserProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);
    const [loading, setLoading] = useState(true);
   
        const getUser = async () => {
            try {
                const res = await axiosInstance.get("/users/me",{
                    headers: {
    "Cache-Control": "no-cache",
  }
                }); // backend verifies token from cookies
                setCurrentUser(res.data.user || null); // e.g., { userId: ... }
            } catch (err) {
                console.error("❌ Error fetching user:", err?.response || err.message);
                setCurrentUser(null);
            } finally {
                setLoading(false);
            }
        };

        useEffect(() => {
            getUser();
          }, []);   

    const login = (user) => {
        setCurrentUser(user);
    };

    const logout = () => {
        setCurrentUser(null);
    };

    return (
        <UserContext.Provider value={{ currentUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
};
