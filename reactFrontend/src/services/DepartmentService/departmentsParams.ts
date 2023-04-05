import { IDepartment, TNewDepartment } from "../../models/Department";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    department: TNewDepartment;
}

export interface PutParams extends Params {
    department: IDepartment;
}

export interface DeleteParams extends Params {
    departmentId: number;
}
