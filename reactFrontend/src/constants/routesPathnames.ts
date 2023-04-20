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
export const EMPLOYEES_ROUTE: Route = {
    NAME: "employees",
    PATH: "/:divisionId/employees",
};
export const ATTENDANCE_ROUTE: Route = {
    NAME: "attendance",
    PATH: "/:divisionId/attendance",
};
export const DEPARTMENTS_ROUTE: Route = {
    NAME: "departments",
    PATH: "/:divisionId/departments",
};
export const UNAUTHORIZED_ROUTE: Route = {
    NAME: "unauthorized",
    PATH: "/unauthorized",
};
export const MISSING_ROUTE: Route = {
    NAME: "missing",
    PATH: "*",
};
