import React from "react";
import LoginForm, { LoginFormState } from "pages/LoginPage/LoginForm";
import { DIVISIONS_ROUTE } from "constants/routesPathnames";
import { ROLES } from "constants/roles";
import { getDivisionRoute } from "helpers/getDivisionRoute";
import Alert from "components/Alert";
import { ALERT } from "constants/alertTypes";
import { useLocation, useNavigate } from "react-router-dom";
import { $error, errorReset } from "./model";
import { useUnit } from "effector-react";
import { loginFx } from "shared/auth";
import { ICredentials } from "shared/api/userApi/login";

import styles from "./styles.module.scss";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const from = location.state?.from?.pathname as string;

    const handleSubmit = async (values: LoginFormState) => {
        const { username, password } = values;

        const credentials: ICredentials = {
            username: username.trim(),
            password,
        };

        try {
            const roles = await loginFx(credentials);
            if (from) {
                navigate(from, { replace: true });
            } else if (roles.includes(ROLES.ADMIN)) {
                navigate(DIVISIONS_ROUTE.PATH);
            } else {
                const route = getDivisionRoute(roles[0]);
                if (route) {
                    navigate(route.path);
                }
            }
        } catch (error) {}
    };

    return (
        <div className={styles.page}>
            <div className={styles.body}>
                <h1>Авторизация</h1>
                <ErrorAlert />
                <LoginForm
                    onSubmit={handleSubmit}
                    disableError={() => errorReset()}
                />
            </div>
        </div>
    );
};

export default LoginPage;

function ErrorAlert() {
    const error = useUnit($error);
    if (error) {
        return (
            <Alert className={styles.alert} type={ALERT.ERROR}>
                {error}
            </Alert>
        );
    }
    return null;
}
