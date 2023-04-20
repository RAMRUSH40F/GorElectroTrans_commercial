import { IEmployee } from "../../models/Employee";

interface Params {
    depId: string;
}

export interface UpdateParams extends Params {
    employee: IEmployee;
}

export interface DeleteParams extends Params {
    studentId: string;
}
