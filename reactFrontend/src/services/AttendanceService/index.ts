import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "../../api";
import { IAttendance } from "../../models/Attendance";
import { DeleteParams, PostParams, PutParams } from "./attendanceParams";

export default class AttendanceService {
    static fetch = (depId: string, config?: AxiosRequestConfig): Promise<AxiosResponse<IAttendance[]>> => {
        return api.get<IAttendance[]>(`/dep_${depId}/attendance/data`, config);
    };
    static post = (
        { depId, attendanceResult }: PostParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IAttendance>> => {
        return api.post<IAttendance>(`/dep_${depId}/attendance/data`, attendanceResult, config);
    };
    static put = (
        { depId, attendanceResult }: PutParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return api.put<void>(`/dep_${depId}/attendance/data`, attendanceResult, config);
    };
    static delete = (
        { depId, attendanceCredentials }: DeleteParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return api.delete<void>(`/dep_${depId}/attendance/data`, { data: attendanceCredentials, ...config });
    };
}
