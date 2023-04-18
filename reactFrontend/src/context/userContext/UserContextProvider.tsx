import React, { useCallback, useEffect, useState } from "react";
import { UserContext } from ".";
import { ROLES } from "../../constants/roles";
import UserService from "../../services/UserService";
import decodeJwt from "jwt-decode";

type Props = {
    children: React.ReactNode;
};

const UserContextProvider: React.FC<Props> = ({ children }) => {
    const [roles, setRoles] = useState<ROLES[]>([]);
    const [isAuth, setIsAuth] = useState(false);
    const [isLoading, setIsLoading] = useState(true);

    const logout = useCallback(() => {
        setIsAuth(false);
        setRoles([]);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        const token = localStorage.getItem("accessToken");

        const authenticateUser = async () => {
            try {
                const response = await UserService.refresh();
                const token = response.headers.authorization;
                const { role } = decodeJwt(token) as { role: ROLES[] };
                setRoles(role as ROLES[]);
                setIsAuth(true);
            } catch (error) {
                const err = error as any;
                if (err?.response?.status === 401) {
                    setRoles([]);
                    setIsAuth(false);
                    localStorage.removeItem("accessToken");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (token) authenticateUser();
        else setIsLoading(false);
    }, []);

    return (
        <UserContext.Provider value={{ roles, setRoles, isAuth, setIsAuth, isLoading, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
