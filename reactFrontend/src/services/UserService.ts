import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api, authApi } from "../api";
import { ICredentials } from "../types/Credentials";

export default class UserService {
    static login = async (credentials: ICredentials, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.post<void>("/auth/login", credentials, config);
    };
    static refresh = async (config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return authApi.post<void>("/auth/validate", undefined, config);
    };
    static logout = async (config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return authApi.post<void>("/auth/logout", undefined, config);
    };
}
