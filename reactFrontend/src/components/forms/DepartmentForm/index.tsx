import { Formik } from "formik";
import React from "react";
import useFocus from "../../../hooks/useFocus";
import { IDepartment, TNewDepartment } from "../../../models/Department";
import ActionButton from "../../buttons/ActionButton";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import { departmentFormScheme } from "./departmentFormSchema";

import "./styles.scss";

type Props = {
    onSubmit: (values: TNewDepartment) => Promise<void>;
    department?: IDepartment;
    moveToConfrim?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
};

const DepartmentForm: React.FC<Props> = ({ onSubmit, department, moveToConfrim, isDisabled }) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    useFocus(inputRef, true);

    const initialState: TNewDepartment = {
        name: department?.name ?? "",
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={departmentFormScheme}>
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting, setFieldValue }) => (
                <form className="department-form" onSubmit={handleSubmit}>
                    <Label className="department-form__label" text="Название отдела">
                        <Input
                            className="department-form__input"
                            ref={inputRef}
                            name="name"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.name}
                            disabled={isSubmitting || isDisabled}
                            placeholder="Отдел"
                            autoComplete="none"
                        />
                        {errors.name && touched.name && <FormErrorMessage>{errors.name}</FormErrorMessage>}
                    </Label>
                    <div className="department-form__actions">
                        {moveToConfrim && department ? (
                            <>
                                <ActionButton disabled={isSubmitting || isDisabled} type="submit" colorType="success">
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
                            <ActionButton disabled={isSubmitting || isDisabled} type="submit" colorType="success">
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
