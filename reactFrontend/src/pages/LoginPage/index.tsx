import React, { useState } from "react";
import LoginForm, { LoginFormState } from "../../components/forms/LoginForm";
import { DIVISIONS_ROUTE } from "../../constants/routesPathnames";
import UserService, { ICredentials } from "../../services/UserService";
import decodeJwt from "jwt-decode";
import { useUserContext } from "../../context/userContext";
import { ROLES } from "../../constants/roles";
import { getDivisionRoute } from "../../helpers/getDivisionRoute";
import Alert from "../../components/Alert";
import { ALERT } from "../../constants/alertTypes";
import { useFromNavigate } from "../../hooks/useFromNavigate";

import "./styles.scss";

const LoginPage: React.FC = () => {
    const navigate = useFromNavigate();
    const { login } = useUserContext();
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (values: LoginFormState) => {
        setError(null);
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
            login(role as ROLES[]);
            if (role.includes(ROLES.ADMIN)) {
                navigate(DIVISIONS_ROUTE.PATH);
            } else {
                const route = getDivisionRoute(role[0]);
                if (route) navigate(route.path);
            }
        } catch (error) {
            const err = error as any;
            console.log(err);
            if (err?.response) {
                setError("Неверный логин или пароль");
            } else {
                setError("Произошла техническая ошибка");
            }
        }
    };

    return (
        <div className="login-page">
            <div className="login-page__body">
                <h1 className="login-page__title">Авторизация</h1>
                {error && (
                    <Alert className="login-page__alert" type={ALERT.ERROR}>
                        {error}
                    </Alert>
                )}
                <LoginForm onSubmit={handleSubmit} disableError={() => setError(null)} />
            </div>
        </div>
    );
};

export default LoginPage;
