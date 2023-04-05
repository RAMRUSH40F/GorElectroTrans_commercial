import { AxiosRequestConfig, AxiosResponse } from "axios";
import { api } from "../../api";
import { IPlan } from "../../models/Plan";
import { PostParams, PutParams, DeleteParams } from "./planParams";

export default class PlanService {
    static fetch = (depId: string, config?: AxiosRequestConfig): Promise<AxiosResponse<IPlan[]>> => {
        return api.get<IPlan[]>(`/dep_${depId}/work_plan/data`, config);
    };
    static post = ({ depId, plan }: PostParams, config?: AxiosRequestConfig): Promise<AxiosResponse<number>> => {
        return api.post<number>(`/dep_${depId}/work_plan/data`, plan, config);
    };
    static put = ({ depId, plan }: PutParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.put<void>(`/dep_${depId}/work_plan/${plan.id}`, plan, config);
    };
    static delete = ({ depId, planId }: DeleteParams, config?: AxiosRequestConfig): Promise<AxiosResponse<void>> => {
        return api.delete<void>(`/dep_${depId}/work_plan/${planId}`, config);
    };
}
