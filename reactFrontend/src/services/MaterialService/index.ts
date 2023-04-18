import { AxiosRequestConfig, AxiosResponse } from "axios";
import { authApi } from "../../api";
import { IMaterial } from "../../models/Material";
import { FileParams, PostParams } from "./materialParams";

export default class MaterialService {
    static fetch = (depId: string, config?: AxiosRequestConfig): Promise<AxiosResponse<IMaterial[]>> => {
        return authApi.get<IMaterial[]>(`/dep_${depId}/content/data`, config);
    };
    static fetchFile = ({ depId, fileName }: FileParams, config?: AxiosRequestConfig): Promise<AxiosResponse<Blob>> => {
        return authApi.get<Blob>(`/dep_${depId}/content/data/${fileName}`, {
            responseType: "blob",
            headers: { "Content-Type": "application/octet-stream" },
            ...config,
        });
    };
    static delete = ({ depId, fileName }: FileParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return authApi.delete<void>(`/dep_${depId}/content/data/${fileName}`, config);
    };
    static post = ({ depId, data }: PostParams, config?: AxiosRequestConfig): Promise<AxiosResponse<IMaterial>> => {
        return authApi.post<IMaterial>(`/dep_${depId}/content/data`, data, {
            headers: {
                "Content-Type": "multipart/form-data",
            },
            ...config,
        });
    };
}
