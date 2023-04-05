export enum ATTENDANCE_RESULT {
    SUCCESS = 1,
    FAIL = 0,
}

export const ATTENDACE_RESULT_VALUE: { [key in ATTENDANCE_RESULT]: string } = {
    [ATTENDANCE_RESULT.SUCCESS]: "Зачет",
    [ATTENDANCE_RESULT.FAIL]: "Незачет",
};
