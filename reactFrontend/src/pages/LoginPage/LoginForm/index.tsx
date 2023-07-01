import { Formik } from "formik";
import React from "react";
import ActionButton from "components/ActionButton";
import FormErrorMessage from "components/formElements/FormErrorMessage";
import Input from "components/formElements/Input";
import Label from "components/formElements/Label";
import { loginFormScheme } from "./loginFormScheme";

import styles from "./styles.module.scss";

export interface LoginFormState {
    username: string;
    password: string;
}

type Props = {
    onSubmit: (values: LoginFormState) => Promise<void>;
    disableError: () => void;
};

const LoginForm: React.FC<Props> = ({ onSubmit, disableError }) => {
    const initialState: LoginFormState = {
        username: "",
        password: "",
    };

    return (
        <Formik
            initialValues={initialState}
            onSubmit={onSubmit}
            validationSchema={loginFormScheme}
        >
            {({
                handleChange,
                handleBlur,
                handleSubmit,
                values,
                isSubmitting,
                errors,
                touched,
            }) => (
                <form aria-label="login form" onSubmit={handleSubmit} onChange={disableError}>
                    <Label className={styles.label}>
                        <Input
                            className={styles.input}
                            name="username"
                            placeholder="Логин"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.username}
                            disabled={isSubmitting}
                            autoComplete="none"
                        />
                        {errors.username && touched.username && (
                            <FormErrorMessage>
                                {errors.username}
                            </FormErrorMessage>
                        )}
                    </Label>
                    <Label className={styles.label}>
                        <Input
                            className={styles.input}
                            name="password"
                            placeholder="Пароль"
                            type="password"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.password}
                            disabled={isSubmitting}
                            autoComplete="none"
                        />
                        {errors.password && touched.password && (
                            <FormErrorMessage>
                                {errors.password}
                            </FormErrorMessage>
                        )}
                    </Label>
                    <ActionButton
                        className={styles.submitBtn}
                        type="submit"
                        disabled={isSubmitting}
                        colorType="info"
                    >
                        Войти
                    </ActionButton>
                </form>
            )}
        </Formik>
    );
};

export default LoginForm;
