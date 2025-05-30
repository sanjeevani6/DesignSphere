import axios from "axios";
export const refreshToken = async () => {
    try {
        const response = await axios.post("/api/v1/users/refresh-token", {}, {
            withCredentials: true, // Ensures cookies are sent
        });

        return response.data.accessToken; // Return new access token
    } catch (error) {
        console.error("Failed to refresh token:", error);
        return error;
    }
};

