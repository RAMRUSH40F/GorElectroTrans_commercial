import React from "react";

import { useUnit } from "effector-react";

import { $roles, ROLES } from "../shared/auth";

type Props = {
    children: React.ReactNode;
    allowedRoles: ROLES[];
};

const CheckAccess: React.FC<Props> = ({ children, allowedRoles }) => {
    const roles = useUnit($roles);
    const isAllowedRole = roles.some((role) => allowedRoles.includes(role));
    return isAllowedRole ? <>{children}</> : null;
};

export default CheckAccess;
