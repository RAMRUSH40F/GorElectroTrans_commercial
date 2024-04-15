import { AxiosError } from "axios";

export interface AbortParams<T> {
    data: T;
    controller: AbortController;
}

export interface DepParams<T> extends AbortParams<T> {
    depId: string;
}

export interface FetchParams<T> extends Omit<DepParams<T>, "data"> {
    page: number;
    size: number;
    search: string;
    sort?: string;
}

export interface FetchResponse<T> {
    data: T;
    totalPages: number;
}

interface AuthErrorResponse {
    message?: string;
    status: number;
}

export type AuthError = AxiosError<AuthErrorResponse>;

export interface ApiError {
    message: string;
    isCanceled: boolean;
}
