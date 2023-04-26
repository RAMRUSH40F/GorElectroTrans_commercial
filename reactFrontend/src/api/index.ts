import axios from "axios";

const API_URL = window.location.origin;

export const api = axios.create({
    baseURL: API_URL,
});

export const authApi = axios.create({
    baseURL: API_URL,
});

authApi.interceptors.request.use((config) => {
    config.headers.authorization = localStorage.getItem("accessToken");
    return config;
});
