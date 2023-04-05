export interface IPlan {
    date: string;
    duration: number;
    id: number;
    peoplePlanned: number;
    teacher: string;
    topic: string;
}

export type TNewPlan = Omit<IPlan, "id">;
