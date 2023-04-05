import React from "react";
import { DepartmentsContext } from ".";
import { IDepartment } from "../../models/Department";

type Props = {
    children: React.ReactNode;
};

const DepartmentsContextProvider: React.FC<Props> = ({ children }) => {
    const [departments, setDepartments] = React.useState<IDepartment[]>([]);

    const updateDepartment = (changedDepartment: IDepartment) => {
        setDepartments((departments) =>
            departments.map((department) =>
                department.id === changedDepartment.id ? { ...department, ...changedDepartment } : department
            )
        );
    };

    const deleteDepartment = (id: number) => {
        setDepartments((departments) => departments.filter((department) => department.id !== id));
    };

    const addDepartment = (newDepartment: IDepartment) => {
        setDepartments((departments) => [newDepartment, ...departments]);
    };

    return (
        <DepartmentsContext.Provider
            value={{ departments, setDepartments, updateDepartment, deleteDepartment, addDepartment }}
        >
            {children}
        </DepartmentsContext.Provider>
    );
};

export default DepartmentsContextProvider;
