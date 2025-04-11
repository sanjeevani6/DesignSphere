import axios from "axios";
import { refreshToken } from "./authService"; // Function to refresh token

const axiosInstance = axios.create({
    baseURL:import.meta.env.VITE_API_URL ||"/",
    withCredentials: true, // Ensures cookies are sent
});
let isRefreshing = false;// Is refresh in progress?
//Ensures you don’t refresh token more than once simultaneously
let failedQueue = [];  // Queue of waiting requests

const processQueue = (error, token = null) => {
    failedQueue.forEach((prom) => {
        if (token) {
            prom.resolve(token);
        } else {
            prom.reject(error);
        }
    });

    failedQueue = [];
};

// Axios Interceptor
axiosInstance.interceptors.response.use(
    (response) => response, // Pass successful responses
    async (error) => {
        const originalRequest = error.config;

        // If the response is 403 (Token expired), try refreshing the token
        if (error.response && error.response.status === 403 && !originalRequest._retry) {
            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({ resolve, reject });
                })
                .then((token) => {
                    originalRequest.headers["Authorization"] = `Bearer ${token}`;
                    return axiosInstance(originalRequest);
                })
                .catch((err) => Promise.reject(err));
            }

            originalRequest._retry = true;
            isRefreshing = true;

            try {
                const newAccessToken = await refreshToken(); // Call refresh token function

                // Process queued requests with the new token
                processQueue(null, newAccessToken);

                originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;
                return axiosInstance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError, null);
                console.error("Failed to refresh token", refreshError);
                window.location.href = "/login"; // Redirect to login if refresh fails
                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default axiosInstance;
