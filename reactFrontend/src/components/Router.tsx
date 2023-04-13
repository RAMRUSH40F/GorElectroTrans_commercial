import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    ATTENDANCE_ROUTE,
    DEPARTMENTS_ROUTE,
    DIVISIONS_ROUTE,
    ROOT_ROUTE,
    EMPLOYEES_ROUTE,
    WORK_PLAN_ROUTE,
} from "../constants/routesPathnames";
import AttendanceContextProvider from "../context/attendanceContext/AttendanceContextProvider";
import DepartmentsContextProvider from "../context/departmentsContext/DepartmentsContextProvider";
import PlansContextProvider from "../context/plansContext/PlansContextProvider";
import EmployeesContextProvider from "../context/employeesContext/EmployeesContextProvider";
import AttendancePage from "../pages/AttendancePage";
import DepartmentsPage from "../pages/DepartmentsPage";
import DivisionsPage from "../pages/DivisionsPage";
import LoginPage from "../pages/LoginPage";
import EmployeesPage from "../pages/EmployeesPage";
import PlanPage from "../pages/PlanPage";
import MainLayout from "./layouts/MainLayout";
import MenuLayout from "./layouts/MenuLayout";

const Router: React.FC = () => {
    return (
        <Routes>
            <Route path={ROOT_ROUTE.PATH} element={<MainLayout />}>
                <Route index element={<LoginPage />} />
                <Route path={DIVISIONS_ROUTE.PATH} element={<DivisionsPage />} />
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
        </Routes>
    );
};

export default Router;
