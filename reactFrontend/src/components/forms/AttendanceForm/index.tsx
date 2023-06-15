import React from "react";
import Label from "../../formElements/Label";
import { TAttendanceDto } from "../../../types/Attendance";
import { ATTENDACE_RESULT_VALUE, ATTENDANCE_RESULT } from "../../../constants/attendanceResult";
import useFocus from "../../../hooks/useFocus";
import { Formik } from "formik";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import ActionButton from "../../buttons/ActionButton";
import { attendanceFormScheme } from "./attendanceFormSheme";
import InputNumber from "../../formElements/InputNumber";
import Dropdown, { DropdownOption } from "../../formElements/Dropdown";

import "./styles.scss";

const options: DropdownOption[] = [
    { label: ATTENDACE_RESULT_VALUE[ATTENDANCE_RESULT.SUCCESS], value: String(ATTENDANCE_RESULT.SUCCESS) },
    { label: ATTENDACE_RESULT_VALUE[ATTENDANCE_RESULT.FAIL], value: String(ATTENDANCE_RESULT.FAIL) },
];

type Props = {
    onSubmit: (values: AttendanceFormState) => Promise<void>;
    attendance?: TAttendanceDto;
    moveToConfrim?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
    isEditing?: boolean;
    clearError?: () => void;
};

export interface AttendanceFormState {
    lessonId: string;
    studentId: string;
    success: DropdownOption;
}

const AttendanceForm: React.FC<Props> = ({
    onSubmit,
    attendance,
    isDisabled,
    moveToConfrim,
    isEditing,
    clearError,
}) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    useFocus(inputRef, true);

    const getInitialSuccessOption = (): DropdownOption => {
        if (attendance) {
            return options.find((option) => option.value === String(attendance.success)) ?? options[0];
        }
        return options[0];
    };

    const initialState: AttendanceFormState = {
        lessonId: attendance?.lessonId ? String(attendance.lessonId) : "",
        studentId: attendance?.studentId ?? "",
        success: getInitialSuccessOption(),
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={attendanceFormScheme}>
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting, setFieldValue }) => (
                <form className="attendance-form" onSubmit={handleSubmit} onChange={clearError}>
                    {!isEditing && (
                        <>
                            <Label className="attendance-form__label" text="Табельный номер">
                                <InputNumber
                                    className="attendance-form__input"
                                    getInputRef={inputRef}
                                    placeholder="Номер"
                                    name="studentId"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.studentId}
                                    disabled={isSubmitting || isDisabled}
                                    autoComplete="none"
                                    allowNegative={false}
                                    allowLeadingZeros={true}
                                    maxLength={5}
                                    decimalScale={0}
                                />
                                {errors.studentId && touched.studentId && (
                                    <FormErrorMessage>{errors.studentId}</FormErrorMessage>
                                )}
                            </Label>
                            <Label className="attendance-form__label" text="Номер занятия">
                                <InputNumber
                                    className="attendance-form__input"
                                    placeholder="Номер"
                                    name="lessonId"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.lessonId}
                                    disabled={isSubmitting || isDisabled}
                                    autoComplete="none"
                                    allowNegative={false}
                                    allowLeadingZeros={false}
                                    decimalScale={0}
                                />
                                {errors.lessonId && touched.lessonId && (
                                    <FormErrorMessage>{errors.lessonId}</FormErrorMessage>
                                )}
                            </Label>
                        </>
                    )}
                    <Label className="attendance-form__label" text="Зачет/Незачет">
                        <Dropdown
                            className="attendance-form__select"
                            options={options}
                            initialOption={values.success}
                            onChange={(option) => {
                                setFieldValue("success", option);
                                clearError && clearError();
                            }}
                            disabled={isSubmitting || isDisabled}
                        />
                    </Label>
                    <div className="attendance-form__actions">
                        {moveToConfrim && attendance ? (
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

export default AttendanceForm;
