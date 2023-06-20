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