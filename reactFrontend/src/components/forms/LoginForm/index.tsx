import { Formik } from "formik";
import React from "react";
import ActionButton from "../../buttons/ActionButton";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import { loginFormScheme } from "./loginFormScheme";

import "./styles.scss";

type Props = {
    onSubmit: (values: LoginFormState) => Promise<void>;
};

export interface LoginFormState {
    email: string;
    password: string;
}

const LoginForm: React.FC<Props> = ({ onSubmit }) => {
    const initialState: LoginFormState = {
        email: "",
        password: "",
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={loginFormScheme}>
            {({ handleChange, handleBlur, handleSubmit, values, isSubmitting, errors, touched }) => (
                <form className="login-form" onSubmit={handleSubmit}>
                    <Label className="login-form__label">
                        <Input
                            className="login-form__input"
                            name="email"
                            placeholder="Логин"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.email}
                            disabled={isSubmitting}
                            autoComplete="none"
                        />
                        {errors.email && touched.email && <FormErrorMessage>{errors.email}</FormErrorMessage>}
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
