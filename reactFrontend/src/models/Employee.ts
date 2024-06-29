export interface IEmployee {
    studentId: string;
    subdepartmentName: string;
    fullName: string;
}

export interface IEmployeeUploadResponse {
    createdStudents: IEmployee[];
    invalidStudentsId: string[];
}
