import React, { useEffect } from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import ActionButton from "../../buttons/ActionButton";
import { IDepartment } from "../../../models/Department";
import { Formik } from "formik";
import { employeeFormScheme } from "./employeeFormScheme";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import { IEmployee } from "../../../models/Employee";
import InputNumber from "../../formElements/InputNumber";
import Dropdown, { DropdownOption } from "../../formElements/Dropdown";

import "./styles.scss";

type Props = {
    onSubmit: (values: EmployeeFormState) => Promise<void>;
    departments: IDepartment[];
    employee?: IEmployee;
    moveToConfrim?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
    isEditing?: boolean;
};

export type EmployeeFormState = {
    studentId: string;
    fullName: string;
    subdepartment: DropdownOption;
};

const EmployeeForm: React.FC<Props> = ({ departments, onSubmit, employee, moveToConfrim, isDisabled, isEditing }) => {
    const employeeIdRef = React.useRef<HTMLInputElement | null>(null);
    const employeeNameRef = React.useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (employeeIdRef.current) {
            employeeIdRef.current.focus();
        }
        if (employeeNameRef.current && !employeeIdRef.current) {
            employeeNameRef.current.focus();
        }
    }, []);

    const options: DropdownOption[] = departments.map((dep) => ({ label: dep.name, value: dep.name }));

    const getInitialSubdepartmentOption = (): DropdownOption => {
        if (employee) {
            return options.find((option) => option.value === String(employee.subdepartmentName)) ?? options[0];
        }
        return options[0];
    };

    const initialState: EmployeeFormState = {
        studentId: employee?.studentId ?? "",
        fullName: employee?.fullName ?? "",
        subdepartment: getInitialSubdepartmentOption(),
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={employeeFormScheme}>
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting, setFieldValue }) => (
                <form className="employee-form" onSubmit={handleSubmit}>
                    {!isEditing && (
                        <>
                            <Label className="employee-form__label" text="Табельный номер">
                                <InputNumber
                                    className="employee-form__input"
                                    getInputRef={employeeIdRef}
                                    rel=""
                                    name="studentId"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.studentId}
                                    disabled={isSubmitting || isDisabled}
                                    placeholder="Номер"
                                    autoComplete="none"
                                    decimalScale={0}
                                    allowLeadingZeros={true}
                                    allowNegative={false}
                                    maxLength={5}
                                />
                                {errors.studentId && touched.studentId && (
                                    <FormErrorMessage>{errors.studentId}</FormErrorMessage>
                                )}
                            </Label>
                        </>
                    )}
                    <Label className="employee-form__label" text="ФИО (полностью)">
                        <Input
                            className="employee-form__input"
                            ref={employeeNameRef}
                            name="fullName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.fullName}
                            disabled={isSubmitting || isDisabled}
                            placeholder="ФИО"
                            autoComplete="none"
                        />
                        {errors.fullName && touched.fullName && <FormErrorMessage>{errors.fullName}</FormErrorMessage>}
                    </Label>
                    <Label className="employee-form__label" text="Отдел">
                        <Dropdown
                            options={options}
                            initialOption={values.subdepartment}
                            onChange={(option) => setFieldValue("subdepartment", option)}
                            disabled={isSubmitting || isDisabled}
                        />
                    </Label>
                    <div className="employee-form__actions">
                        {moveToConfrim && employee ? (
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

export default EmployeeForm;
