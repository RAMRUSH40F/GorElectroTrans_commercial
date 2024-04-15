import axios, { AxiosRequestConfig } from "axios";
import { createEffect } from "effector";

import { AuthError } from "./types";

// uncomment for production
// const API_URL = window.location.origin;
const API_URL = "http://localhost:8082";

export const api = axios.create({ baseURL: API_URL });
export const authApi = axios.create({ baseURL: API_URL });

export const requestFx = createEffect<AxiosRequestConfig, any>((config) =>
    api(config),
);

export const authRequestFx = createEffect<AxiosRequestConfig, any, AuthError>(
    ({ headers, ...rest }: AxiosRequestConfig) =>
        api({
            headers: {
                authorization: localStorage.getItem("accessToken"),
                ...headers,
            },
            ...rest,
        }),
);
