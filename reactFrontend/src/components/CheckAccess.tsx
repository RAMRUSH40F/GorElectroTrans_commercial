import { FC } from "react";

import { useUnit } from "effector-react";

import { $roles, ROLES } from "../shared/auth";

type Props = {
    children: React.ReactNode;
    allowedRoles: ROLES[];
    enabled?: boolean;
};

const CheckAccess: FC<Props> = ({ children, allowedRoles, enabled = true }) => {
    const roles = useUnit($roles);

    if (!enabled) return <>{children}</>;

    const isAllowedRole = roles.some((role) => allowedRoles.includes(role));

    return isAllowedRole ? <>{children}</> : null;
};

export default CheckAccess;
