import { useUnit } from "effector-react";

import { $roles, ROLES } from "shared/auth";

export const useRole = () => {
    const roles = useUnit($roles);

    const isAdmin = roles.includes(ROLES.ADMIN);

    return { isAdmin, roles };
};
