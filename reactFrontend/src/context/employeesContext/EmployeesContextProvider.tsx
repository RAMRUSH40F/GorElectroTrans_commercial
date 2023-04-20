import React, { useState } from "react";
import { EmployeesContext } from ".";
import { IEmployee } from "../../models/Employee";

type Props = {
    children: React.ReactNode;
};

const EmployeesContextProvider: React.FC<Props> = ({ children }) => {
    const [employees, setEmployees] = useState<IEmployee[]>([]);

    const updateEmployee = (changedStudent: IEmployee) => {
        setEmployees((employees) =>
            employees.map((employee) =>
                employee.studentId === changedStudent.studentId ? { ...employee, ...changedStudent } : employee
            )
        );
    };

    const addEmployee = (newEmployee: IEmployee) => {
        setEmployees((employees) => [newEmployee, ...employees]);
    };

    const deleteEmployee = (id: string) => {
        setEmployees((employees) => employees.filter((employee) => employee.studentId !== id));
    };

    return (
        <EmployeesContext.Provider
            value={{
                employees,
                setEmployees,
                deleteEmployee,
                updateEmployee,
                addEmployee,
            }}
        >
            {children}
        </EmployeesContext.Provider>
    );
};

export default EmployeesContextProvider;
