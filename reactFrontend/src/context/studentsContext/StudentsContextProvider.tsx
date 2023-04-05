import React, { useState } from "react";
import { StudentsContext } from ".";
import { IDepartment } from "../../models/Department";
import { IStudent } from "../../models/Student";

type Props = {
    children: React.ReactNode;
};

const StudentsContextProvider: React.FC<Props> = ({ children }) => {
    const [students, setStudents] = useState<IStudent[]>([]);
    const [departments, setDepartments] = useState<IDepartment[]>([]);

    const updateStudents = (changedStudent: IStudent) => {
        setStudents((students) =>
            students.map((student) =>
                student.studentId === changedStudent.studentId ? { ...student, ...changedStudent } : student
            )
        );
    };

    const addStudent = (newStudent: IStudent) => {
        setStudents((students) => [newStudent, ...students]);
    };

    const deleteStudent = (id: string) => {
        setStudents((students) => students.filter((student) => student.studentId !== id));
    };

    return (
        <StudentsContext.Provider
            value={{ students, setStudents, departments, setDepartments, deleteStudent, updateStudents, addStudent }}
        >
            {children}
        </StudentsContext.Provider>
    );
};

export default StudentsContextProvider;
