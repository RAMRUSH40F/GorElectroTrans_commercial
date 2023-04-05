import { INewStudent } from "../../models/Student";

interface Params {
    depId: string;
}

export interface PostParams extends Params {
    student: INewStudent;
}

export interface DeleteParams extends Params {
    studentId: string;
}

export interface PutParams extends Params {
    student: INewStudent;
}
