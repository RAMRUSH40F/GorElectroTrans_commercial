import React from "react";
import { AttendanceContext } from ".";
import { IAttendance, IAttendanceCredentials, TNewAttendance } from "../../models/Attendance";

type Props = {
    children: React.ReactNode;
};

const AttendanceContextProvider: React.FC<Props> = ({ children }) => {
    const [attendances, setAttendances] = React.useState<IAttendance[]>([]);

    const updateAttendance = (changedAttendance: TNewAttendance) => {
        const updatedAttendance: IAttendance[] = attendances.map((attendance) => {
            if (
                attendance.lessonId === changedAttendance.lessonId &&
                attendance.studentId === changedAttendance.studentId
            ) {
                return { ...attendance, ...changedAttendance };
            }
            return attendance;
        });
        setAttendances(updatedAttendance);
    };

    const deleteAttendance = ({ lessonId, studentId }: IAttendanceCredentials) => {
        const filteredAttendances: IAttendance[] = attendances.filter((attendance) => {
            return attendance.lessonId !== lessonId || attendance.studentId !== studentId;
        });
        setAttendances(filteredAttendances);
    };

    const addAttendance = (newAttendance: IAttendance) => {
        setAttendances((attendances) => [newAttendance, ...attendances]);
    };

    return (
        <AttendanceContext.Provider
            value={{ attendances, setAttendances, updateAttendance, deleteAttendance, addAttendance }}
        >
            {children}
        </AttendanceContext.Provider>
    );
};

export default AttendanceContextProvider;
