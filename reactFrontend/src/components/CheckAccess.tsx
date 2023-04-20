import React from "react";
import { ROLES } from "../constants/roles";
import { useUserContext } from "../context/userContext";

type Props = {
    children: React.ReactNode;
    allowedRoles: ROLES[];
};

const CheckAccess: React.FC<Props> = ({ children, allowedRoles }) => {
    const { roles } = useUserContext();
    const isAllowedRole = roles.some((role) => allowedRoles.includes(role));
    return isAllowedRole ? <>{children}</> : null;
};

export default CheckAccess;
