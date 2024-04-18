export interface IPlan {
    date: string;
    duration: number;
    id: number;
    peoplePlanned: number;
    teacher: string;
    teacherPost: string;
    isHeld: boolean;
    topic: string;
    lessonContent: string[];
}

export type PlanDto = Omit<IPlan, "id">;

export interface IMaterial {
    lessonId: number;
    fileName: string;
}

export enum PLAN_STATUS {
    HELD = 1,
    SCHEDULED = 0,
}

export const PLAN_STATUS_VALUE: { [key in PLAN_STATUS]: string } = {
    [PLAN_STATUS.HELD]: "Проведено",
    [PLAN_STATUS.SCHEDULED]: "Запланировано",
};
