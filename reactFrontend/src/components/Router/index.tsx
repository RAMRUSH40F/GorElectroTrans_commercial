import React from "react";

import { Route, Routes } from "react-router-dom";

import AttendancePage from "pages/AttendancePage";
import DepartmentsPage from "pages/DepartmentsPage";
import DivisionsPage from "pages/DivisionsPage";
import EmployeesPage from "pages/EmployeesPage";
import LoginPage from "pages/LoginPage";
import MissingPage from "pages/MissingPage";
import PlanPage from "pages/PlanPage";
import UnauthorizedPage from "pages/UnauthorizedPage";

import { ROLES } from "shared/auth";

import MainLayout from "../layouts/MainLayout";
import MenuLayout from "../layouts/MenuLayout";

import HomeRoute from "./HomeRoute";
import ProtectedDepartmentRoute from "./ProtectedDepartmentRoute";
import RoleProtectedRoute from "./RoleProtectedRoute";
import {
    ATTENDANCE_ROUTE,
    DEPARTMENTS_ROUTE,
    DIVISIONS_ROUTE,
    EMPLOYEES_ROUTE,
    LOGIN_ROUTE,
    MISSING_ROUTE,
    ROOT_ROUTE,
    UNAUTHORIZED_ROUTE,
    WORK_PLAN_ROUTE,
} from "./routesPathnames";

const Router: React.FC = () => {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path={LOGIN_ROUTE.PATH} element={<LoginPage />} />
                <Route
                    element={
                        <RoleProtectedRoute allowedRoles={[ROLES.ADMIN]} />
                    }
                >
                    <Route
                        path={DIVISIONS_ROUTE.PATH}
                        element={<DivisionsPage />}
                    />
                </Route>

                <Route element={<ProtectedDepartmentRoute />}>
                    <Route element={<MenuLayout />}>
                        <Route
                            path={WORK_PLAN_ROUTE.PATH}
                            element={<PlanPage />}
                        />
                        <Route
                            path={EMPLOYEES_ROUTE.PATH}
                            element={<EmployeesPage />}
                        />
                        <Route
                            path={DEPARTMENTS_ROUTE.PATH}
                            element={<DepartmentsPage />}
                        />
                        <Route
                            path={ATTENDANCE_ROUTE.PATH}
                            element={<AttendancePage />}
                        />
                    </Route>
                </Route>
            </Route>
            <Route path={ROOT_ROUTE.PATH} element={<HomeRoute />} />
            <Route
                path={UNAUTHORIZED_ROUTE.PATH}
                element={<UnauthorizedPage />}
            />
            <Route path={MISSING_ROUTE.PATH} element={<MissingPage />} />
        </Routes>
    );
};

export default Router;
