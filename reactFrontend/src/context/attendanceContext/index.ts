import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { IAttendance, IAttendanceCredentials, TNewAttendance } from "../../models/Attendance";

interface AttendanceState {
    attendances: IAttendance[];
    setAttendances: Dispatch<SetStateAction<IAttendance[]>>;
    updateAttendance: (changedAttendance: TNewAttendance) => void;
    deleteAttendance: (attendanceCredentials: IAttendanceCredentials) => void;
    addAttendance: (newAttendance: IAttendance) => void;
}

export const AttendanceContext = createContext<AttendanceState>({} as AttendanceState);
export const useAttendanceContext = () => useContext(AttendanceContext);
