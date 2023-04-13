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

export type TNewPlan = Omit<IPlan, "id">;
