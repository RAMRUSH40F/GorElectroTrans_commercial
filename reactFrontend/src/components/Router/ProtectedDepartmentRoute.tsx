import React from "react";

import { useUnit } from "effector-react";
import { Navigate, Outlet, useLocation, useParams } from "react-router-dom";

import {
    LOGIN_ROUTE,
    UNAUTHORIZED_ROUTE,
} from "components/Router/routesPathnames";

import { $isAuth, $roles, ROLES } from "shared/auth";

const ProtectedDepartmentRoute: React.FC = () => {
    const location = useLocation();
    const { divisionId } = useParams();
    const [isAuth, roles] = useUnit([$isAuth, $roles]);

    if (isAuth) {
        const isAllowedRole = roles.some(
            (role) => role === divisionId || role === ROLES.ADMIN,
        );
        return isAllowedRole ? (
            <Outlet />
        ) : (
            <Navigate
                to={UNAUTHORIZED_ROUTE.PATH}
                state={{ from: location }}
                replace
            />
        );
    }

    return (
        <Navigate to={LOGIN_ROUTE.PATH} state={{ from: location }} replace />
    );
};

export default ProtectedDepartmentRoute;
