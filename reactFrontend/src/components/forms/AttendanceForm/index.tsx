import React from "react";
import Label from "../../formElements/Label";
import DropDown, { Option } from "react-dropdown";
import { TNewAttendance } from "../../../models/Attendance";
import { ATTENDACE_RESULT_VALUE, ATTENDANCE_RESULT } from "../../../constants/attendanceResult";
import useFocus from "../../../hooks/useFocus";
import { Formik } from "formik";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import ActionButton from "../../buttons/ActionButton";
import { attendanceFormScheme } from "./attendanceFormSheme";
import InputNumber from "../../formElements/InputNumber";

import "react-dropdown/style.css";
import "./styles.scss";

const options: Option[] = [
    { label: ATTENDACE_RESULT_VALUE[ATTENDANCE_RESULT.SUCCESS], value: String(ATTENDANCE_RESULT.SUCCESS) },
    { label: ATTENDACE_RESULT_VALUE[ATTENDANCE_RESULT.FAIL], value: String(ATTENDANCE_RESULT.FAIL) },
];

type Props = {
    onSubmit: (values: AttendanceFormState) => Promise<void>;
    attendance?: TNewAttendance;
    moveToConfrim?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    isDisabled?: boolean;
    isEditing?: boolean;
};

export interface AttendanceFormState {
    lessonId: string;
    studentId: string;
    success: ATTENDANCE_RESULT;
}

const AttendanceForm: React.FC<Props> = ({ onSubmit, attendance, isDisabled, moveToConfrim, isEditing }) => {
    const inputRef = React.useRef<HTMLInputElement | null>(null);
    useFocus(inputRef, true);

    const initialState: AttendanceFormState = {
        lessonId: attendance?.lessonId ? String(attendance.lessonId) : "",
        studentId: attendance?.studentId ?? "",
        success: attendance?.success ?? parseInt(options[0].value),
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={attendanceFormScheme}>
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting, setFieldValue }) => (
                <form className="attendance-form" onSubmit={handleSubmit}>
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
                        <DropDown
                            className="attendance-form__select"
                            options={options}
                            value={ATTENDACE_RESULT_VALUE[values.success]}
                            onChange={(option) => setFieldValue("success", parseInt(option.value))}
                            disabled={isSubmitting || isDisabled}
                        />
                        {errors.success && touched.success && <FormErrorMessage>{errors.success}</FormErrorMessage>}
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
