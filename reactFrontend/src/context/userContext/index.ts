import { Dispatch, SetStateAction, createContext, useContext } from "react";
import { ROLES } from "../../constants/roles";

interface UserState {
    roles: ROLES[];
    setRoles: Dispatch<SetStateAction<ROLES[]>>;
    isAuth: boolean;
    setIsAuth: Dispatch<SetStateAction<boolean>>;
    isLoading: boolean;
    error: string | null;
    login: (roles: ROLES[]) => void;
    logout: () => void;
}

export const UserContext = createContext<UserState>({} as UserState);
export const useUserContext = () => useContext(UserContext);
