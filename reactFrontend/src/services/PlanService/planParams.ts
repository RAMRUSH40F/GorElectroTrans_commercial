import { IPlan, TPlanDto } from "../../models/Plan";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    plan: TPlanDto;
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