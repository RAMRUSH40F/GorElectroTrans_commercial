import { WORK_PLAN_ROUTE } from "components/Router/routesPathnames";

export type DivisionRoute = {
    name: string;
    allowedRole: string;
    path: string;
};

export const DIVISIONS_ROUTES: DivisionRoute[] = [
    {
        allowedRole: "1",
        name: "ОСП «Трамвайный парк №1»",
        path: `/1/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "6",
        name: "«Совмещенный трамвайно-троллейбусный парк»",
        path: `/6/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "11",
        name: "СП «Служба подвижного состава»",
        path: `/11/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "2",
        name: "ОСП «Трамвайный парк №3»",
        path: `/2/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "7",
        name: "ОСП «Троллейбусный парк №1»",
        path: `/7/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "12",
        name: "ОСП «Служба движения»",
        path: `/12/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "3",
        name: "ОСП «Трамвайный парк №5»",
        path: `/3/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "8",
        name: "ОСП «Троллейбусный парк №2»",
        path: `/8/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "13",
        name: "ОСП «Служба пути»",
        path: `/13/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "4",
        name: "ОСП «Трамвайный парк №7»",
        path: `/4/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "9",
        name: "ОСП «Троллейбусный парк №3»",
        path: `/9/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "14",
        name: "ОСП «Аварийно-восстановительное хозяйство «Носорог»",
        path: `/14/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "5",
        name: "ОСП «Трамвайный парк №8»",
        path: `/5/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "10",
        name: "ОСП «Троллейбусный парк №6»",
        path: `/10/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        allowedRole: "15",
        name: "ОСП «Энергохозяйство»",
        path: `/15/${WORK_PLAN_ROUTE.NAME}`,
    },
];
