import { FC, MouseEvent, useEffect, useRef } from "react";

import { Formik } from "formik";

import ActionButton from "components/ActionButton";
import CheckAccess from "components/CheckAccess";
import Dropdown, { DropdownOption } from "components/formElements/Dropdown";
import FormErrorMessage from "components/formElements/FormErrorMessage";
import Input from "components/formElements/Input";
import InputNumber from "components/formElements/InputNumber";
import Label from "components/formElements/Label";

import { IDepartment } from "models/Department";
import { IEmployee } from "models/Employee";

import { ROLES } from "shared/auth";

import { modalOpened } from "../EmployeesUploading/model";

import { employeeFormScheme } from "./employeeFormScheme";

import styles from "./styles.module.scss";

type Props = {
    onSubmit: (values: EmployeeFormState) => Promise<void>;
    departments: IDepartment[];
    clearError?: () => void;
    employee?: IEmployee | null;
    moveToConfirm?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
    isEditing?: boolean;
};

export type EmployeeFormState = {
    studentId: string;
    fullName: string;
    subdepartment: DropdownOption;
};

const EmployeeForm: FC<Props> = ({
    departments,
    onSubmit,
    employee,
    moveToConfirm,
    clearError,
    isDisabled,
    isEditing,
}) => {
    const employeeIdRef = useRef<HTMLInputElement | null>(null);
    const employeeNameRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (employeeIdRef.current) {
            employeeIdRef.current.focus();
        }
        if (employeeNameRef.current && !employeeIdRef.current) {
            employeeNameRef.current.focus();
        }
    }, []);

    const options: DropdownOption[] = departments.map((dep) => ({
        label: dep.name,
        value: dep.name,
    }));

    const getInitialSubdepartmentOption = (): DropdownOption => {
        if (employee) {
            return (
                options.find(
                    (option) =>
                        option.value === String(employee.subdepartmentName),
                ) ?? options[0]
            );
        }
        return options[0];
    };

    const initialState: EmployeeFormState = {
        studentId: employee?.studentId ?? "",
        fullName: employee?.fullName ?? "",
        subdepartment: getInitialSubdepartmentOption(),
    };

    const handleOpenEmployeesUploading = (
        event: MouseEvent<HTMLButtonElement>,
    ) => {
        event.stopPropagation();
        modalOpened();
    };

    console.log(isEditing);

    return (
        <Formik
            initialValues={initialState}
            onSubmit={onSubmit}
            validationSchema={employeeFormScheme}
        >
            {({
                handleSubmit,
                handleChange,
                handleBlur,
                values,
                errors,
                touched,
                isSubmitting,
                setFieldValue,
            }) => (
                <form
                    onSubmit={handleSubmit}
                    onChange={clearError}
                    aria-label="employee form"
                >
                    {!isEditing && (
                        <>
                            <Label
                                className={styles.label}
                                text="Табельный номер"
                            >
                                <InputNumber
                                    className={styles.input}
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
                                    <FormErrorMessage>
                                        {errors.studentId}
                                    </FormErrorMessage>
                                )}
                            </Label>
                        </>
                    )}
                    <Label className={styles.label} text="ФИО (полностью)">
                        <Input
                            className={styles.input}
                            ref={employeeNameRef}
                            name="fullName"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.fullName}
                            disabled={isSubmitting || isDisabled}
                            placeholder="ФИО"
                            autoComplete="none"
                        />
                        {errors.fullName && touched.fullName && (
                            <FormErrorMessage>
                                {errors.fullName}
                            </FormErrorMessage>
                        )}
                    </Label>
                    <CheckAccess
                        allowedRoles={[ROLES.ADMIN]}
                        enabled={isEditing}
                    >
                        <Label className={styles.label} text="Отдел">
                            <Dropdown
                                options={options}
                                initialOption={values.subdepartment}
                                onChange={(option) => {
                                    setFieldValue("subdepartment", option);
                                    clearError && clearError();
                                }}
                                disabled={isSubmitting || isDisabled}
                            />
                        </Label>
                    </CheckAccess>
                    <div className={styles.controls}>
                        {moveToConfirm && employee ? (
                            <>
                                <ActionButton
                                    disabled={isSubmitting || isDisabled}
                                    type="submit"
                                    colorType="success"
                                >
                                    Сохранить
                                </ActionButton>
                                <CheckAccess allowedRoles={[ROLES.ADMIN]}>
                                    <ActionButton
                                        disabled={isSubmitting || isDisabled}
                                        onClick={moveToConfirm}
                                        type="button"
                                        colorType="danger"
                                    >
                                        Удалить
                                    </ActionButton>
                                </CheckAccess>
                            </>
                        ) : (
                            <>
                                <ActionButton
                                    disabled={isSubmitting || isDisabled}
                                    type="button"
                                    colorType="info"
                                    onClick={handleOpenEmployeesUploading}
                                >
                                    Загрузить
                                </ActionButton>
                                <ActionButton
                                    disabled={isSubmitting || isDisabled}
                                    type="submit"
                                    colorType="success"
                                >
                                    Добавить
                                </ActionButton>
                            </>
                        )}
                    </div>
                </form>
            )}
        </Formik>
    );
};

export default EmployeeForm;
