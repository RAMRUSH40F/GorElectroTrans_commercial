import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    ATTENDANCE_ROUTE,
    DEPARTMENTS_ROUTE,
    DIVISIONS_ROUTE,
    ROOT_ROUTE,
    EMPLOYEES_ROUTE,
    WORK_PLAN_ROUTE,
    UNAUTHORIZED_ROUTE,
    MISSING_ROUTE,
    LOGIN_ROUTE,
} from "../../constants/routesPathnames";
import AttendanceContextProvider from "../../context/attendanceContext/AttendanceContextProvider";
import DepartmentsContextProvider from "../../context/departmentsContext/DepartmentsContextProvider";
import PlansContextProvider from "../../context/plansContext/PlansContextProvider";
import EmployeesContextProvider from "../../context/employeesContext/EmployeesContextProvider";
import AttendancePage from "../../pages/AttendancePage";
import DepartmentsPage from "../../pages/DepartmentsPage";
import DivisionsPage from "../../pages/DivisionsPage";
import LoginPage from "../../pages/LoginPage";
import EmployeesPage from "../../pages/EmployeesPage";
import PlanPage from "../../pages/PlanPage";
import MainLayout from "../layouts/MainLayout";
import MenuLayout from "../layouts/MenuLayout";
import RoleProtectedRoute from "./RoleProtectedRoute";
import { ROLES } from "../../constants/roles";
import ProtectedDepartmentRoute from "./ProtectedDepartmentRoute";
import MissingPage from "../../pages/MissingPage";
import UnauthorizedPage from "../../pages/UnauthorizedPage";
import HomeRoute from "./HomeRoute";

const Router: React.FC = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path={LOGIN_ROUTE.PATH} element={<LoginPage />} />

                <Route element={<RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />}>
                    <Route path={DIVISIONS_ROUTE.PATH} element={<DivisionsPage />} />
                </Route>

                <Route element={<ProtectedDepartmentRoute />}>
                    <Route element={<MenuLayout />}>
                        <Route
                            path={WORK_PLAN_ROUTE.PATH}
                            element={
                                <PlansContextProvider>
                                    <PlanPage />
                                </PlansContextProvider>
                            }
                        />
                        <Route
                            path={EMPLOYEES_ROUTE.PATH}
                            element={
                                <EmployeesContextProvider>
                                    <EmployeesPage />
                                </EmployeesContextProvider>
                            }
                        />
                        <Route
                            path={DEPARTMENTS_ROUTE.PATH}
                            element={
                                <DepartmentsContextProvider>
                                    <DepartmentsPage />
                                </DepartmentsContextProvider>
                            }
                        />
                        <Route
                            path={ATTENDANCE_ROUTE.PATH}
                            element={
                                <AttendanceContextProvider>
                                    <AttendancePage />
                                </AttendanceContextProvider>
                            }
                        />
                    </Route>
                </Route>
            </Route>
            <Route path={ROOT_ROUTE.PATH} element={<HomeRoute />} />
            <Route path={UNAUTHORIZED_ROUTE.PATH} element={<UnauthorizedPage />} />
            <Route path={MISSING_ROUTE.PATH} element={<MissingPage />} />
        </Routes>
    );
};

export default Router;
