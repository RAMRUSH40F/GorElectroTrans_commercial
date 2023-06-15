import React from "react";
import { ROLES } from "../../constants/roles";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "../../constants/routesPathnames";
import { useUnit } from "effector-react";
import { $isAuth, $roles } from "../../shared/auth";

type Props = {
    allowedRoles: ROLES[];
};

const RoleProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
    const location = useLocation();
    const [isAuth, roles] = useUnit([$isAuth, $roles]);

    if (isAuth) {
        const isAllowedRole = roles.some((role) => allowedRoles.includes(role));
        return isAllowedRole ? (
            <Outlet />
        ) : (
            <Navigate to={UNAUTHORIZED_ROUTE.PATH} state={{ from: location }} replace />
        );
    }

    return <Navigate to={LOGIN_ROUTE.PATH} state={{ from: location }} replace />;
};

export default RoleProtectedRoute;
