import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm, { LoginFormState } from "../../components/forms/LoginForm";
import { DIVISIONS_ROUTE } from "../../constants/routesPathnames";
import { ICredentials } from "../../types/Credentials";
import UserService from "../../services/UserService";
import decodeJwt from "jwt-decode";
import { useUserContext } from "../../context/userContext";
import { ROLES } from "../../constants/roles";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";

import "./styles.scss";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const { setRoles, setIsAuth } = useUserContext();

    const handleSubmit = async (values: LoginFormState) => {
        const { username, password } = values;

        const credentials: ICredentials = {
            username: username.trim(),
            password,
        };

        try {
            const response = await UserService.login(credentials);
            const token = response.headers.authorization;
            const { role } = decodeJwt(token) as { role: ROLES[] };
            localStorage.setItem("accessToken", token);
            console.log(role);
            setRoles(role as ROLES[]);
            setIsAuth(true);
            if (role.includes(ROLES.ADMIN)) {
                navigate(DIVISIONS_ROUTE.PATH);
            } else {
                const route = getDivisionRoute(role[0]);
                if (route) navigate(route.path);
            }
        } catch (error) {
            console.log(error);
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__body">
                <h1 className="login-page__title">Авторизация</h1>
                <LoginForm onSubmit={handleSubmit} />
            </div>
        </div>
    );
};

export default LoginPage;
