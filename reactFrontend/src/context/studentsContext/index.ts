import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IDepartment } from "../../models/Department";
import { IStudent } from "../../models/Student";

interface StudentsState {
    students: IStudent[];
    setStudents: Dispatch<SetStateAction<IStudent[]>>;
    departments: IDepartment[];
    setDepartments: Dispatch<SetStateAction<IDepartment[]>>;
    updateStudents: (changedStudent: IStudent) => void;
    addStudent: (newStudent: IStudent) => void;
    deleteStudent: (id: string) => void;
}

export const StudentsContext = createContext<StudentsState>({} as StudentsState);
export const useStudentsContext = () => useContext(StudentsContext);
