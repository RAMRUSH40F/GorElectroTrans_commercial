import { authApi } from "../../shared/api";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { IEmployee } from "../../models/Employee";
import { DeleteParams, UpdateParams } from "./employeeParams";

export default class EmployeeService {
    static fetch = (
        depId: string,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IEmployee[]>> => {
        return authApi.get<IEmployee[]>(`/dep_${depId}/students/data`, config);
    };
    static post = (
        { depId, employee }: UpdateParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IEmployee>> => {
        return authApi.post<IEmployee>(
            `/dep_${depId}/students/data`,
            employee,
            config
        );
    };
    static put = (
        { depId, employee }: UpdateParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return authApi.put<void>(
            `/dep_${depId}/students/data`,
            employee,
            config
        );
    };
    static delete = (
        { depId, studentId }: DeleteParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return authApi.delete<void>(
            `/dep_${depId}/students/${studentId}`,
            config
        );
    };
}
