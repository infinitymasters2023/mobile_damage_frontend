import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

// Helper to safely fetch token on client-side
const getAccessToken = (): string | null => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }
    return null;
};

// Centralized logout routine to purge all storage tiers and state
const handleLogout = (): void => {
    if (typeof window !== "undefined") {
        localStorage.clear();
        sessionStorage.clear();

        // Clear all accessible domain cookies by expiring them in the past
        document.cookie.split(";").forEach((cookie) => {
            const cookieName = cookie.split("=")[0].trim();
            document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
        });

        window.location.href = "/";
    }
};

// 1. Core Axios Instance definition
const ApiAxios = axios.create({
    baseURL: "http://192.168.1.7:7800",
    // Options for alternative environments:
    // baseURL: "https://infysalesapi.infyshield.com/"
    // baseURL: "http://localhost:7800/",
    // baseURL: process.env.NEXT_PUBLIC_Backend_URL,
});

// 2. Request Interceptor: Injects Bearer authorization token dynamically
ApiAxios.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token && request.headers) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// 3. Response Interceptor: Catches 401 Unauthorized globally for auto-logout
ApiAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            handleLogout();
        }
        return Promise.reject(error);
    }
);

/* ==========================================================================
   Modular HTTP Request Wrappers with Strict TypeScript Return Types
   ========================================================================== */

export const get = async <T = unknown>(url: string, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await ApiAxios.get<T>(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const post = async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await ApiAxios.post<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const postForm = async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await ApiAxios.postForm<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const del = async <T = unknown>(url: string, data?: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await ApiAxios.delete<T>(url, { ...config, data });
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const put = async <T = unknown>(url: string, data: unknown, config?: AxiosRequestConfig): Promise<T> => {
    try {
        const response = await ApiAxios.put<T>(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

/* ==========================================================================
   API Endpoint Services 
   ========================================================================== */

// Get NaturesOfBusiness List
export const getNaturesOfBusinessApi = async (): Promise<unknown> => {
    return await get("company/natureOfBusiness");
};