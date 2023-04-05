type Route = {
    NAME: string;
    PATH: string;
};

export const ROOT_ROUTE: Route = {
    NAME: "root",
    PATH: "/",
};
export const LOGIN_ROUTE: Route = {
    NAME: "login",
    PATH: ROOT_ROUTE.PATH,
};
export const DIVISIONS_ROUTE: Route = {
    NAME: "divisions",
    PATH: "/divisions",
};
export const WORK_PLAN_ROUTE: Route = {
    NAME: "work-plan",
    PATH: "/:divisionId/work-plan",
};
export const STUDENTS_ROUTE: Route = {
    NAME: "students",
    PATH: "/:divisionId/students",
};
export const ATTENDANCE_ROUTE: Route = {
    NAME: "attendance",
    PATH: "/:divisionId/attendance",
};
export const MATERIALS_ROUTE: Route = {
    NAME: "materials",
    PATH: "/:divisionId/materials",
};
export const DEPARTMENTS_ROUTE: Route = {
    NAME: "departments",
    PATH: "/:divisionId/departments",
};
