import { authApi } from "../../shared/api";
import { AxiosRequestConfig, AxiosResponse } from "axios";
import { IDepartment } from "../../models/Department";
import { PostParams, PutParams, DeleteParams } from "./departmentsParams";

export default class DepartmentService {
    static fetch = (
        depId: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IDepartment[]>> => {
        return authApi.get<IDepartment[]>(`/dep_${depId}/subdep/data`, config);
    };
    static post = (
        { depId, department }: PostParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IDepartment>> => {
        return authApi.post<IDepartment>(
            `/dep_${depId}/subdep/data`,
            department,
            config
        );
    };
    static put = (
        { depId, department }: PutParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return authApi.put<void>(
            `/dep_${depId}/subdep/data`,
            department,
            config
        );
    };
    static delete = (
        { depId, departmentId }: DeleteParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return authApi.delete<void>(
            `/dep_${depId}/subdep/${departmentId}`,
            config
        );
    };
}
