import React from "react";
import LoginForm from "../../components/forms/LoginForm";

import "./styles.scss";

const LoginPage: React.FC = () => {
    return (
        <div className="login-page">
            <div className="login-page__body">
                <h1 className="login-page__title">Авторизация</h1>
                <LoginForm />
            </div>
        </div>
    );
};

export default LoginPage;
