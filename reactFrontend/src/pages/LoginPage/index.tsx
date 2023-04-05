import React from "react";
import { useNavigate } from "react-router-dom";
import LoginForm, { LoginFormState } from "../../components/forms/LoginForm";
import { DIVISIONS_ROUTE } from "../../constants/routesPathnames";

import "./styles.scss";

const LoginPage: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = async (values: LoginFormState) => {
        console.log(values);
        navigate(DIVISIONS_ROUTE.PATH);
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
