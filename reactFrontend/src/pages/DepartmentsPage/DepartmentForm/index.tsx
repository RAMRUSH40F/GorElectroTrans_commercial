import { Formik } from "formik";
import React from "react";
import useFocus from "../../../hooks/useFocus";
import { IDepartment, TDepartmentDto } from "../../../models/Department";
import ActionButton from "../../../components/buttons/ActionButton";
import FormErrorMessage from "../../../components/formElements/FormErrorMessage";
import Input from "../../../components/formElements/Input";
import Label from "../../../components/formElements/Label";
import { departmentFormScheme } from "./departmentFormSchema";

import styles from "./styles.module.scss";

type Props = {
    onSubmit: (values: TDepartmentDto) => Promise<void>;
    clearError?: () => void;
    department?: IDepartment | null;
    moveToConfrim?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
};

const DepartmentForm: React.FC<Props> = ({
    onSubmit,
    department,
    clearError,
    moveToConfrim,
    isDisabled,
}) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    useFocus(inputRef, true);

    const initialState: TDepartmentDto = {
        name: department?.name ?? "",
    };

    return (
        <Formik
            initialValues={initialState}
            onSubmit={onSubmit}
            validationSchema={departmentFormScheme}
        >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isSubmitting,
            }) => (
                <form onSubmit={handleSubmit} onChange={clearError}>
                    <Label className={styles.label} text="Название отдела">
                        <Input
                            className={styles.input}
                            ref={inputRef}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            disabled={isSubmitting || isDisabled}
                            placeholder="Отдел"
                            autoComplete="none"
                        />
                        {errors.name && touched.name && (
                            <FormErrorMessage>{errors.name}</FormErrorMessage>
                        )}
                    </Label>
                    <div className={styles.controls}>
                        {moveToConfrim && department ? (
                            <>
                                <ActionButton
                                    disabled={isSubmitting || isDisabled}
                                    type="submit"
                                    colorType="success"
                                >
                                    Сохранить
                                </ActionButton>
                                <ActionButton
                                    disabled={isSubmitting || isDisabled}
                                    onClick={moveToConfrim}
                                    type="button"
                                    colorType="danger"
                                >
                                    Удалить
                                </ActionButton>
                            </>
                        ) : (
                            <ActionButton
                                disabled={isSubmitting || isDisabled}
                                type="submit"
                                colorType="success"
                            >
                                Добавить
                            </ActionButton>
                        )}
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default DepartmentForm;
