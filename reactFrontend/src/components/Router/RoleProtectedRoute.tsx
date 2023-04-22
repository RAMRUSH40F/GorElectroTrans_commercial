import React from "react";
import { ROLES } from "../../constants/roles";
import { useUserContext } from "../../context/userContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "../../constants/routesPathnames";

type Props = {
    allowedRoles: ROLES[];
};

const RoleProtectedRoute: React.FC<Props> = ({ allowedRoles }) => {
    const location = useLocation();
    const { roles, isAuth } = useUserContext();

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
