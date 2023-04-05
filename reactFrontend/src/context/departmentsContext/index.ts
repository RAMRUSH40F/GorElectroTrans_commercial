import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IDepartment } from "../../models/Department";

interface DepartmentsState {
    departments: IDepartment[];
    setDepartments: Dispatch<SetStateAction<IDepartment[]>>;
    updateDepartment: (changedDepartment: IDepartment) => void;
    deleteDepartment: (id: number) => void;
    addDepartment: (newDepartment: IDepartment) => void;
}

export const DepartmentsContext = createContext<DepartmentsState>({} as DepartmentsState);
export const useDepartmentsContext = () => useContext(DepartmentsContext);
