interface BaseStudent {
    studentId: string;
    subdepartmentName: string;
}

export interface IStudent extends BaseStudent {
    fullName: string;
}

export interface INewStudent extends BaseStudent {
    fullName: string | null;
}
