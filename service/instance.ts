
import axios, { AxiosError, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from "axios";

const getAccessToken = () => {
    if (typeof window !== "undefined") {
        return localStorage.getItem("authToken");
    }
    return null;
};

const handleLogout = () => {
    localStorage.clear();
    sessionStorage.clear();

    // Clear cookies
    document.cookie.split(";").forEach((cookie) => {
        const cookieName = cookie.split("=")[0].trim();
        // Set each cookie's expiry date to the past to delete
        document.cookie = `${cookieName}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
    });

    window.location.href = "/";
};
const ApiAxios = axios.create({
    //   baseURL: "https://infysalesapi.infyshield.com/"
    // baseURL: "http://localhost:7800/",
    baseURL: "http://192.168.1.7:7800",
    // baseURL: process.env.NEXT_PUBLIC_Backend_URL,
    // baseURL : "http://10.40.20.191:7800/"
});

ApiAxios.interceptors.request.use(
    (request: InternalAxiosRequestConfig) => {
        const token = getAccessToken();
        if (token) {
            request.headers.Authorization = `Bearer ${token}`;
        }
        return request;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

ApiAxios.interceptors.response.use(
    (response: AxiosResponse) => {
        return response;
    },
    (error: AxiosError) => {
        if (error.response?.status === 401) {
            handleLogout();
        }
        return Promise.reject(error);
    },
);

export const get = async (url: string, config?: AxiosRequestConfig) => {
    try {
        const response = await ApiAxios.get(url, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};

export const post = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    try {
        const response = await ApiAxios.post(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}

export const postForm = async (url: string, data?: any, config?: AxiosRequestConfig) => {
    try {
        const response = await ApiAxios.postForm(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
}
export const del = async (
    url: string,
    data?: any,
    config?: AxiosRequestConfig
) => {
    try {
        const response = await ApiAxios.delete(url, { ...config, data });
        return response.data;
    } catch (error) {
        throw error;
    }
};
export const put = async (
    url: string,
    data: any,
    config?: AxiosRequestConfig
) => {
    try {
        const response = await ApiAxios.put(url, data, config);
        return response.data;
    } catch (error) {
        throw error;
    }
};
//Get NaturesOfBusiness List
export const getNaturesOfBusinessApi = async (): Promise<any> => {
    return await get('company/natureOfBusiness')
};

