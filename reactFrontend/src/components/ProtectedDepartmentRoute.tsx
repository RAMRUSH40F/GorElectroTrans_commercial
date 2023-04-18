import React from "react";
import { Outlet, Navigate, useParams } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "../constants/routesPathnames";
import { ROLES } from "../constants/roles";

const ProtectedDepartmentRoute: React.FC = () => {
    const { roles, isAuth } = useUserContext();
    const { divisionId } = useParams();

    if (isAuth) {
        const isAllowedRole = roles.some((role) => role === divisionId || role === ROLES.ADMIN);
        return isAllowedRole ? <Outlet /> : <Navigate to={UNAUTHORIZED_ROUTE.PATH} />;
    }

    return <Navigate to={LOGIN_ROUTE.PATH} />;
};

export default ProtectedDepartmentRoute;
