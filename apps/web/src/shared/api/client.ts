/// <reference types="vite/client" />
import axios, { AxiosInstance, AxiosError, InternalAxiosRequestConfig } from 'axios';
import { useAppStore } from '@/shared/kernel/store';

// Define base URL (mock for now, or env variable)
const BASE_URL = import.meta.env.VITE_API_URL || '/api/v1';

// Create Axios Instance
export const apiClient: AxiosInstance = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request Interceptor: Attach Token
apiClient.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        // Get token from store (accessing state outside of React component)
        const token = useAppStore.getState().token;

        if (token && config.headers) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor: Handle 401 & Refresh Token
apiClient.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

        // If 401 Unauthorized and not already retried
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                // --- SIMULATED TOKEN REFRESH LOGIC ---
                // In real app: const { data } = await axios.post('/auth/refresh', { token: refreshToken });
                console.log('🔄 Attempting to refresh token...');

                // Simulate waiting for refresh
                await new Promise(resolve => setTimeout(resolve, 500));

                // Mock new token
                const newToken = "new-mock-jwt-token-" + Date.now();

                // Update store with new token
                useAppStore.getState().login(newToken, 'user'); // Re-login updates token

                // Update authorization header
                if (originalRequest.headers) {
                    originalRequest.headers.Authorization = `Bearer ${newToken}`;
                }

                // Retry original request
                return apiClient(originalRequest);
            } catch (refreshError) {
                // If refresh fails, logout user
                console.error('❌ Token refresh failed. Logging out.');
                useAppStore.getState().logout();
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);
