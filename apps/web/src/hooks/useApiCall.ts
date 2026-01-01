import { useState } from 'react';
import { toast } from 'sonner';

export interface ApiCallOptions {
    successMessage?: string;
    errorMessage?: string;
    onSuccess?: () => void;
    onError?: () => void;
}

// Core helper function that can be used outside of React components (e.g. in Zustand stores)
export const executeApiCall = async <T>(apiFunction: () => Promise<T>, options: ApiCallOptions = {}) => {
    try {
        const data = await apiFunction();
        if (options.successMessage) {
            toast.success(options.successMessage);
        }
        options.onSuccess?.();
        return data;
    } catch (error: any) {
        const msg = options.errorMessage || error?.message || 'An error occurred';
        toast.error(msg);
        options.onError?.();
        // console.error('API Error:', error); // Optional: keep logs clean or log? User had console.error.
        console.error('API Error:', error);
        throw error;
    }
};

export const useApiCall = <T>(apiFunction: () => Promise<T>, options: ApiCallOptions = {}) => {
    const [loading, setLoading] = useState(false);

    const call = async () => {
        setLoading(true);
        try {
            return await executeApiCall(apiFunction, options);
        } finally {
            setLoading(false);
        }
    };

    return { call, loading };
};
