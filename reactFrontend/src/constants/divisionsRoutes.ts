import { ROOT_ROUTE, WORK_PLAN_ROUTE } from "./routesPathnames";

export type Division = {
    name: string;
    id: string;
    route: string;
};

export const DIVISIONS_ROUTES: Division[] = [
    {
        id: "1",
        name: "ОСП «Трамвайный парк №1»",
        route: ROOT_ROUTE.PATH + `/1/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "2",
        name: "«Совмещенный трамвайно-троллейбусный парк»",
        route: ROOT_ROUTE.PATH + `/2/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "3",
        name: "СП «Служба подвижного состава»",
        route: `/3/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "4",
        name: "ОСП «Трамвайный парк №3»",
        route: ROOT_ROUTE.PATH + `/4/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "5",
        name: "ОСП «Троллейбусный парк №1»",
        route: ROOT_ROUTE.PATH + `/5/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "6",
        name: "ОСП «Служба движения»",
        route: ROOT_ROUTE.PATH + `/6/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "7",
        name: "ОСП «Трамвайный парк №5»",
        route: ROOT_ROUTE.PATH + `/7/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "8",
        name: "ОСП «Троллейбусный парк №2»",
        route: ROOT_ROUTE.PATH + `/8/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "9",
        name: "ОСП «Служба пути»",
        route: ROOT_ROUTE.PATH + `/9/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "10",
        name: "ОСП «Трамвайный парк №7»",
        route: ROOT_ROUTE.PATH + `/10/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "11",
        name: "ОСП «Троллейбусный парк №3»",
        route: ROOT_ROUTE.PATH + `/11/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "12",
        name: "ОСП «Аварийно-восстановительное хозяйство «Носорог»",
        route: ROOT_ROUTE.PATH + `/12/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "13",
        name: "ОСП «Трамвайный парк №8»",
        route: ROOT_ROUTE.PATH + `/13/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "14",
        name: "ОСП «Троллейбусный парк №6»",
        route: ROOT_ROUTE.PATH + `/14/${WORK_PLAN_ROUTE.NAME}`,
    },
    {
        id: "15",
        name: "ОСП «Энергохозяйство»",
        route: ROOT_ROUTE.PATH + `/15/${WORK_PLAN_ROUTE.NAME}`,
    },
];
