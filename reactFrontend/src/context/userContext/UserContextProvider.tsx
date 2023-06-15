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
    const [error, setError] = useState<string | null>(null);

    const login = useCallback((roles: ROLES[]) => {
        setRoles(roles);
        setIsAuth(true);
    }, []);

    const logout = useCallback(() => {
        setIsAuth(false);
        setRoles([]);
    }, []);

    useEffect(() => {
        setIsLoading(true);
        setError(null);

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
                    logout();
                    localStorage.removeItem("accessToken");
                } else {
                    const message =
                        err?.response?.data?.message ??
                        "Произошла техническая ошибка. Попробуйте перезагрузить страницу.";
                    setError(message);
                }
            } finally {
                setIsLoading(false);
            }
        };
        setIsLoading(false);
        // if (localStorage.getItem("accessToken")) authenticateUser();
        // else setIsLoading(false);
    }, [logout]);

    return (
        <UserContext.Provider value={{ roles, setRoles, setIsAuth, isLoading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export default UserContextProvider;
