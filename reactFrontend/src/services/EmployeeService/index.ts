import { api } from "../../api";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { IEmployee } from "../../models/Employee";
import { DeleteParams, UpdateParams } from "./employeeParams";

export default class EmployeeService {
    static fetch = (depId: string, config?: AxiosRequestConfig): Promise<AxiosResponse<IEmployee[]>> => {
        return api.get<IEmployee[]>(`/dep_${depId}/students/data`, config);
    };
    static post = (
        { depId, employee }: UpdateParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IEmployee>> => {
        return api.post<IEmployee>(`/dep_${depId}/students/data`, employee, config);
    };
    static put = ({ depId, employee }: UpdateParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.put<void>(`/dep_${depId}/students/data`, employee, config);
    };
    static delete = ({ depId, studentId }: DeleteParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.delete<void>(`/dep_${depId}/students/${studentId}`, config);
    };
}
