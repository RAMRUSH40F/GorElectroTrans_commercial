import { IPlan, PlanDto } from "../../models/Plan";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    plan: PlanDto;
}

export interface PutParams extends Params {
    plan: IPlan;
}

export interface DeleteParams extends Params {
    planId: number;
}

export interface FileParams extends Params {
    fileName: string;
}

export interface PostFileParams extends Params {
    data: FormData;
}