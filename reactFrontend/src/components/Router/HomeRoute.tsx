import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { ROLES } from "../../constants/roles";
import { DIVISIONS_ROUTE, LOGIN_ROUTE, UNAUTHORIZED_ROUTE } from "../../constants/routesPathnames";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import { $isAuth, $roles } from "../../shared/auth";
import { useUnit } from "effector-react";

const HomeRoute: React.FC = () => {
    const location = useLocation();
    const [isAuth, roles] = useUnit([$isAuth, $roles]);

    if (!isAuth) return <Navigate to={LOGIN_ROUTE.PATH} state={{ from: location }} replace />;

    if (roles.includes(ROLES.ADMIN)) {
        return <Navigate to={DIVISIONS_ROUTE.PATH} />;
    }

    const divisionRoute = getDivisionRoute(roles.find((role) => role !== ROLES.ADMIN) || roles[0]);
    if (divisionRoute) {
        return <Navigate to={divisionRoute.path} />;
    }

    return <Navigate to={UNAUTHORIZED_ROUTE.PATH} state={{ from: location }} replace />;
};

export default HomeRoute;
