import axios from "axios";

// const API_URL = window.location.origin;

export const api = axios.create({
    // baseURL: API_URL,
    baseURL: "http://82.146.38.158:8081",
});

export const authApi = axios.create({
    // baseURL: API_URL,
    baseURL: "http://82.146.38.158:8081",
});

authApi.interceptors.request.use((config) => {
    config.headers.authorization = localStorage.getItem("accessToken");
    return config;
});
