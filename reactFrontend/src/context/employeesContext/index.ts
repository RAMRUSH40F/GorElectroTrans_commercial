import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IEmployee } from "../../models/Employee";

interface EmployeesState {
    employees: IEmployee[];
    setEmployees: Dispatch<SetStateAction<IEmployee[]>>;
    updateEmployee: (changedStudent: IEmployee) => void;
    addEmployee: (newStudent: IEmployee) => void;
    deleteEmployee: (id: string) => void;
}

export const EmployeesContext = createContext<EmployeesState>({} as EmployeesState);
export const useEmployeesContext = () => useContext(EmployeesContext);
