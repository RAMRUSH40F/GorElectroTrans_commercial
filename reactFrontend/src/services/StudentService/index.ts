import { api } from "../../api";
import { AxiosResponse, AxiosRequestConfig } from "axios";
import { IStudent } from "../../models/Student";
import { DeleteParams, PostParams, PutParams } from "./studentsParams";

export default class StudentsService {
    static fetch = (depId: string, config?: AxiosRequestConfig): Promise<AxiosResponse<IStudent[]>> => {
        return api.get<IStudent[]>(`/dep_${depId}/students/data`, config);
    };
    static post = ({ depId, student }: PostParams, config?: AxiosRequestConfig): Promise<AxiosResponse<IStudent>> => {
        return api.post<IStudent>(`/dep_${depId}/students/data`, student, config);
    };
    static put = ({ depId, student }: PutParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.put<void>(`/dep_${depId}/students/data`, student, config);
    };
    static delete = ({ depId, studentId }: DeleteParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.delete<void>(`/dep_${depId}/students/${studentId}`, config);
    };
}
