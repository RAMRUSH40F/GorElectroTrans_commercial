import { Formik } from "formik";
import React from "react";
import ActionButton from "../../buttons/ActionButton";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import { loginFormScheme } from "./loginFormScheme";

import "./styles.scss";

export interface LoginFormState {
    username: string;
    password: string;
}

type Props = {
    onSubmit: (values: LoginFormState) => Promise<void>;
};

const LoginForm: React.FC<Props> = ({ onSubmit }) => {
    const initialState: LoginFormState = {
        username: "",
        password: "",
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={loginFormScheme}>
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched }) => (
                <form className="login-form" onSubmit={handleSubmit}>
                    <Label className="login-form__label">
                        <Input
                            className="login-form__input"
                            name="username"
                            placeholder="Логин"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            disabled={isSubmitting}
                            autoComplete="none"
                        />
                        {errors.username && touched.username && <FormErrorMessage>{errors.username}</FormErrorMessage>}
                    </Label>
                    <Label className="login-form__label">
                        <Input
                            className="login-form__input"
                            name="password"
                            placeholder="Пароль"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            disabled={isSubmitting}
                            autoComplete="none"
                        />
                        {errors.password && touched.password && <FormErrorMessage>{errors.password}</FormErrorMessage>}
                    </Label>
                    <ActionButton className="login-form__button" type="submit" colorType="info">
                        Войти
                    </ActionButton>
                </form>
            )}
        </Formik>
    );
};

export default LoginForm;
