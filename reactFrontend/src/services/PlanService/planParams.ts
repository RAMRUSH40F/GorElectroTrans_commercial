import { IPlan, TNewPlan } from "../../models/Plan";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    plan: TNewPlan;
}

export interface PutParams extends Params {
    plan: IPlan;
}

export interface DeleteParams extends Params {
    planId: number;
}
