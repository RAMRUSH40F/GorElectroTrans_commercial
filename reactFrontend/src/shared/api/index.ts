import axios, { AxiosError, AxiosRequestConfig } from "axios";
import { createEffect } from "effector";

export interface AbortParams<T> {
    data: T;
    controller: AbortController;
}

export interface DepParams<T> extends AbortParams<T> {
    depId: string;
}

interface AuthErrorResponse {
    message?: string;
    status: number;
}

export type AuthError = AxiosError<AuthErrorResponse>;

// const API_URL = window.location.origin;
const API_URL = "http://82.146.38.158:8081";

export const api = axios.create({ baseURL: API_URL });
export const authApi = axios.create({ baseURL: API_URL });

authApi.interceptors.request.use((config) => {
    config.headers.authorization =
        localStorage.getItem("accessToken") ?? "accesstoken123";
    return config;
});

export const requestFx = createEffect<AxiosRequestConfig, any>((config) =>
    api(config)
);

export const authRequestFx = createEffect<AxiosRequestConfig, any, AuthError>(
    (config) =>
        api({
            headers: {
                authorization: localStorage.getItem("accessToken"),
            },
            ...config,
        })
);
