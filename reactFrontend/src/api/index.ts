import axios from "axios";

export const api = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

export const authApi = axios.create({
    baseURL: process.env.REACT_APP_API_URL,
});

authApi.interceptors.request.use((config) => {
    config.headers.authorization = localStorage.getItem("accessToken");
    return config;
});
