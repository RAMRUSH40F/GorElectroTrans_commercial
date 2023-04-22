export interface IDepartment {
    id: number;
    name: string;
}

export type TDepartmentDto = Omit<IDepartment, "id">;
