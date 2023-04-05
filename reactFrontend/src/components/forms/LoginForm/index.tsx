import React from "react";
import { useNavigate } from "react-router-dom";
import { DIVISIONS_ROUTE } from "../../../constants/routesPathnames";
import ActionButton from "../../buttons/ActionButton";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";

import "./styles.scss";

const LoginForm: React.FC = () => {
    const navigate = useNavigate();

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();
        navigate(DIVISIONS_ROUTE.PATH);
    };

    return (
        <form className="login-form" onSubmit={handleSubmit}>
            <Label className="login-form__label">
                <Input className="login-form__input" placeholder="Логин" />
            </Label>
            <Label className="login-form__label">
                <Input className="login-form__input" placeholder="Пароль" type="password" />
            </Label>
            <ActionButton className="login-form__button" colorType="add">
                Войти
            </ActionButton>
        </form>
    );
};

export default LoginForm;
