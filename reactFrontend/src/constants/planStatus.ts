export enum PLAN_STATUS {
    HELD = 1,
    SCHEDULED = 0,
}

export const PLAN_STATUS_VALUE: { [key in PLAN_STATUS]: string } = {
    [PLAN_STATUS.HELD]: "Проведено",
    [PLAN_STATUS.SCHEDULED]: "Запланированно",
};
