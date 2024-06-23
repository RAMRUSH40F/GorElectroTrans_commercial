export interface IPlan {
    date: string;
    duration: number;
    id: number;
    peoplePlanned: number;
    teacher: string;
    teacherPost: string;
    isHeld: boolean;
    status: PLAN_STATUS;
    comment: string | null;
    topic: string;
    lessonContent: string[];
}

export type PlanDto = Omit<IPlan, "id">;

export interface IMaterial {
    lessonId: number;
    fileName: string;
}

export enum PLAN_STATUS {
    PLANNED = "PLANNED",
    HELD = "HELD",
    CANCELLED = "CANCELLED",
    RESCHEDULED = "RESCHEDULED",
}

export const PLAN_STATUS_VALUE: { [key in PLAN_STATUS]: string } = {
    [PLAN_STATUS.PLANNED]: "Запланировано",
    [PLAN_STATUS.HELD]: "Проведено",
    [PLAN_STATUS.RESCHEDULED]: "Перенесено",
    [PLAN_STATUS.CANCELLED]: "Отменено",
};
