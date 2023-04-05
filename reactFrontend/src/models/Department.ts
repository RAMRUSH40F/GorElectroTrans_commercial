export interface IDepartment {
    id: number;
    name: string;
}

export type TNewDepartment = Omit<IDepartment, "id">;
