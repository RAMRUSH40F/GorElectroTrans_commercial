type Route = {
    NAME: string;
    PATH: string;
};

export const ROOT_ROUTE: Route = {
    NAME: "root",
    PATH: "/GorElectroTrans",
};
export const LOGIN_ROUTE: Route = {
    NAME: "login",
    PATH: ROOT_ROUTE.PATH,
};
export const DIVISIONS_ROUTE: Route = {
    NAME: "divisions",
    PATH: ROOT_ROUTE.PATH + "/divisions",
};
export const WORK_PLAN_ROUTE: Route = {
    NAME: "work-plan",
    PATH: ROOT_ROUTE.PATH + "/:dep_id/work-plan",
};
export const STUDENTS_ROUTE: Route = {
    NAME: "students",
    PATH: ROOT_ROUTE.PATH + "/:dep_id/students",
};
export const ATTENDANCE_ROUTE: Route = {
    NAME: "attendance",
    PATH: ROOT_ROUTE.PATH + "/:dep_id/attendance",
};
export const MATERIALS_ROUTE: Route = {
    NAME: "materials",
    PATH: ROOT_ROUTE.PATH + "/:dep_id/materials",
};
export const DEPARTMENTS_ROUTE: Route = {
    NAME: "departments",
    PATH: ROOT_ROUTE.PATH + "/:dep_id/departments",
};
