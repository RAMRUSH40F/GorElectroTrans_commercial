import { AxiosRequestConfig, AxiosResponse } from "axios";
import { authApi } from "../../api";
import { DeleteParams, PostParams, PutParams } from "./attendanceParams";
import { IAttendance } from "../../types/Attendance";

export default class AttendanceService {
    static fetch = (depId: string, config?: AxiosRequestConfig): Promise<AxiosResponse<IAttendance[]>> => {
        return authApi.get<IAttendance[]>(`/dep_${depId}/attendance/data`, config);
    };
    static post = (
        { depId, attendanceResult }: PostParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<IAttendance>> => {
        return authApi.post<IAttendance>(`/dep_${depId}/attendance/data`, attendanceResult, config);
    };
    static put = (
        { depId, attendanceResult }: PutParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return authApi.put<void>(`/dep_${depId}/attendance/data`, attendanceResult, config);
    };
    static delete = (
        { depId, attendanceCredentials }: DeleteParams,
        config?: AxiosRequestConfig
    ): Promise<AxiosResponse<void>> => {
        return authApi.delete<void>(`/dep_${depId}/attendance/data`, { data: attendanceCredentials, ...config });
    };
}
