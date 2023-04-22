import React from "react";
import { Outlet, Navigate, useParams, useLocation } from "react-router-dom";
import { useUserContext } from "../../context/userContext";
import { LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "../../constants/routesPathnames";
import { ROLES } from "../../constants/roles";

const ProtectedDepartmentRoute: React.FC = () => {
    const location = useLocation();
    const { roles, isAuth } = useUserContext();
    const { divisionId } = useParams();

    if (isAuth) {
        const isAllowedRole = roles.some((role) => role === divisionId || role === ROLES.ADMIN);
        return isAllowedRole ? (
            <Outlet />
        ) : (
            <Navigate to={UNAUTHORIZED_ROUTE.PATH} state={{ from: location }} replace />
        );
    }

    return <Navigate to={LOGIN_ROUTE.PATH} state={{ from: location }} replace />;
};

export default ProtectedDepartmentRoute;
