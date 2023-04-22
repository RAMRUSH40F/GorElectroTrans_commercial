import { IDepartment, TDepartmentDto } from "../../models/Department";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    department: TDepartmentDto;
}

export interface PutParams extends Params {
    department: IDepartment;
}

export interface DeleteParams extends Params {
    departmentId: number;
}
