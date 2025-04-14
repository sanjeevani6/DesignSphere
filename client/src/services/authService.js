import axios from "axios";
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const refreshToken = async () => {
    try {
        const response = await axios.post(`${BASE_URL}/users/refresh-token`, {}, {
            withCredentials: true, // Ensures cookies are sent
        });

        return response.data.accessToken; // Return new access token
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return error;
    }
};

