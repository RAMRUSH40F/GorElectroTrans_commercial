import React from "react";
import { Routes, Route } from "react-router-dom";
import {
    ATTENDANCE_ROUTE,
    DEPARTMENTS_ROUTE,
    DIVISIONS_ROUTE,
    ROOT_ROUTE,
    MATERIALS_ROUTE,
    STUDENTS_ROUTE,
    WORK_PLAN_ROUTE,
} from "../constants/routesPathnames";
import AttendanceContextProvider from "../context/attendanceContext/AttendanceContextProvider";
import DepartmentsContextProvider from "../context/departmentsContext/DepartmentsContextProvider";
import MaterialsContextProvider from "../context/materialsContext/MaterialsContextProvider";
import PlansContextProvider from "../context/plansContext/PlansContextProvider";
import StudentsContextProvider from "../context/studentsContext/StudentsContextProvider";
import AttendancePage from "../pages/AttendancePage";
import DepartmentsPage from "../pages/DepartmentsPage";
import DivisionsPage from "../pages/DivisionsPage";
import LoginPage from "../pages/LoginPage";
import MaterialsPage from "../pages/MaterialsPage";
import StudentsPage from "../pages/StudentsPage";
import WorkPlanPage from "../pages/WorkPlanPage";
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
                                <WorkPlanPage />
                            </PlansContextProvider>
                        }
                    />
                    <Route
                        path={STUDENTS_ROUTE.PATH}
                        element={
                            <StudentsContextProvider>
                                <StudentsPage />
                            </StudentsContextProvider>
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
                    <Route
                        path={MATERIALS_ROUTE.PATH}
                        element={
                            <MaterialsContextProvider>
                                <MaterialsPage />
                            </MaterialsContextProvider>
                        }
                    />
                </Route>
            </Route>
        </Routes>
    );
};

export default Router;
