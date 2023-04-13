import React from "react";
import useFocus from "../../../hooks/useFocus";
import { IPlan } from "../../../models/Plan";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import Textarea from "../../formElements/Textarea";
import DateInput from "../../formElements/DateInput";
import { Formik } from "formik";
import ActionButton from "../../buttons/ActionButton";
import { planFormScheme } from "./planFormScheme";
import FormErrorMessage from "../../formElements/FormErrorMessage";
import InputNumber from "../../formElements/InputNumber";
import { Option } from "react-dropdown";
import { PLAN_STATUS, PLAN_STATUS_VALUE } from "../../../constants/planStatus";
import Select from "../../formElements/Select";

import "./styles.scss";

const teacherOptions: Option[] = [
    { label: "Руководитель/зам.руководителя", value: "post-1" },
    { label: "Ст. мастер/мастер", value: "post-2" },
    { label: "Наставник", value: "post-3" },
    { label: "Cпециалист по техническому обучению", value: "post-4" },
    { label: "Другое", value: "post-5" },
];
const statusOptions: Option[] = [
    { label: PLAN_STATUS_VALUE[PLAN_STATUS.SCHEDULED], value: String(PLAN_STATUS.SCHEDULED) },
    { label: PLAN_STATUS_VALUE[PLAN_STATUS.HELD], value: String(PLAN_STATUS.HELD) },
];

type Props = {
    onSubmit: (values: PlanFormValues) => Promise<void>;
    plan?: IPlan;
    isDisabled?: boolean;
    isEditing?: boolean;
    moveToConfrim?: (event: React.MouseEvent<HTMLButtonElement>) => void;
    openMaterialsEditing?: (event: React.MouseEvent<HTMLButtonElement>) => void;
};

export type PlanFormValues = {
    date: string;
    duration: string;
    peoplePlanned: string;
    teacher: string;
    topic: string;
    teacherPost: Option;
    status: Option;
};

const PlanForm: React.FC<Props> = ({ onSubmit, plan, moveToConfrim, isDisabled, isEditing, openMaterialsEditing }) => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);
    useFocus(textareaRef, true);

    const initialDate = plan?.date ? new Date(plan.date) : new Date();
    const [date, setDate] = React.useState<Date | null>(initialDate);

    const getInitialTeacherPostOption = (): Option => {
        if (plan) {
            return teacherOptions.find((option) => option.label === String(plan.teacherPost)) ?? teacherOptions[0];
        }
        return teacherOptions[0];
    };
    const getInitialStatusOption = (): Option => {
        if (plan) {
            return statusOptions.find((option) => option.value === String(plan.isHeld)) ?? statusOptions[0];
        }
        return statusOptions[0];
    };

    const initialState: PlanFormValues = {
        date: initialDate.toISOString(),
        duration: plan?.duration ? String(plan.duration) : "1",
        peoplePlanned: plan?.peoplePlanned ? String(plan.peoplePlanned) : "10",
        teacher: plan?.teacher ?? "",
        topic: plan?.topic ?? "",
        teacherPost: getInitialTeacherPostOption(),
        status: getInitialStatusOption(),
    };

    return (
        <Formik initialValues={initialState} onSubmit={onSubmit} validationSchema={planFormScheme}>
            {({ handleSubmit, handleChange, handleBlur, values, errors, touched, isSubmitting, setFieldValue }) => (
                <form onSubmit={handleSubmit} className="plan-form">
                        <Label className="plan-form__label plan-form__label--mb" text="Тема занятия">
                            <Textarea
                                className="plan-form__textarea"
                                ref={textareaRef}
                                name="topic"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.topic}
                                disabled={isSubmitting || isDisabled}
                                placeholder="Тема"
                            />
                            {errors.topic && touched.topic && <FormErrorMessage>{errors.topic}</FormErrorMessage>}
                        </Label>
                        <div className="plan-form__row">
                            <Label className="plan-form__label" text="Дата">
                                <DateInput
                                    className="plan-form__input"
                                    name="date"
                                    onChange={(date, event) => {
                                        event?.stopPropagation();
                                        setDate(date);
                                        setFieldValue("date", date?.toISOString());
                                    }}
                                    selected={date}
                                    disabled={isSubmitting || isDisabled}
                                    autoComplete="none"
                                />
                                {errors.date && touched.date && <FormErrorMessage>{errors.date}</FormErrorMessage>}
                            </Label>
                            <Label className="plan-form__label" text="Длительность/ч.">
                                <InputNumber
                                    className="plan-form__input"
                                    name="duration"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.duration}
                                    disabled={isSubmitting || isDisabled}
                                    placeholder="Длительность"
                                    decimalScale={2}
                                    allowNegative={false}
                                    autoComplete="none"
                                />
                                {errors.duration && touched.duration && (
                                    <FormErrorMessage>{errors.duration}</FormErrorMessage>
                                )}
                            </Label>
                            <Label className="plan-form__label plan-form__label--mb" text="Кол-во людей">
                                <InputNumber
                                    className="plan-form__input"
                                    name="peoplePlanned"
                                    onBlur={handleBlur}
                                    onChange={handleChange}
                                    value={values.peoplePlanned}
                                    disabled={isSubmitting || isDisabled}
                                    placeholder="Количество"
                                    allowLeadingZeros={false}
                                    decimalScale={0}
                                    allowNegative={false}
                                    autoComplete="none"
                                />
                                {errors.peoplePlanned && touched.peoplePlanned && (
                                    <FormErrorMessage>{errors.peoplePlanned}</FormErrorMessage>
                                )}
                            </Label>
                        </div>
                        <Label className="plan-form__label plan-form__label--mb" text="ФИО преподавателя">
                            <Input
                                className="plan-form__input"
                                name="teacher"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.teacher}
                                disabled={isSubmitting || isDisabled}
                                placeholder="ФИО"
                                autoComplete="none"
                            />
                            {errors.teacher && touched.teacher && <FormErrorMessage>{errors.teacher}</FormErrorMessage>}
                        </Label>
                        <Label className="plan-form__label  plan-form__label--mb" text="Должность преподавателя">
                            <Select
                                className="plan-form__select"
                                options={teacherOptions}
                                value={values.teacherPost}
                                onChange={(option) => setFieldValue("teacherPost", option)}
                                disabled={isSubmitting || isDisabled}
                            />
                        </Label>
                        {isEditing && (
                            <Label className="plan-form__label" text="Статус занятия">
                                <Select
                                    className="plan-form__select"
                                    options={statusOptions}
                                    value={values.status}
                                    onChange={(option) => setFieldValue("status", option)}
                                    disabled={isSubmitting || isDisabled}
                                />
                            </Label>
                        )}
                    <div className="plan-form__actions">
                        {moveToConfrim && plan ? (
                            <>
                                <ActionButton
                                    className="plan-form__action-button plan-form__action-button--materials"
                                    onClick={openMaterialsEditing}
                                    disabled={isSubmitting || isDisabled}
                                    type="button"
                                    colorType="info"
                                >
                                    <svg
                                        className="plan-form__materials-icon"
                                        xmlns="http://www.w3.org/2000/svg"
                                        enableBackground="new 0 0 50 50"
                                        viewBox="0 0 50 50"
                                        id="workbook"
                                    >
                                        <path d="M47.2 5.9h-2.9V4.4c0-.4-.2-.7-.5-.9C38 .4 30.8.3 25 3.3c-5.8-3-13-2.9-18.7.2C5.9 3.7 5.7 4 5.7 4.4v1.5H2.8C1.8 5.9 1 6.7 1 7.7v26.2c0 1 .8 1.8 1.8 1.8 9.8 0 18.5 0 44.3 0 1 0 1.8-.8 1.8-1.8V7.7C49 6.7 48.2 5.9 47.2 5.9zM42.3 5v1.9c0 0 0 0 0 0s0 0 0 0v22.6C35.8 29.9 31 30.6 26 33.1V5C31 2.5 37.2 2.5 42.3 5zM7.7 5C12.8 2.5 19 2.5 24 5v28.1c-5-2.4-9.8-3.2-16.3-3.6V5zM3 7.9h2.7v22.6c0 .5.4 1 1 1 5.5.3 9.7.8 13.7 2.2H3V7.9zM47 33.7H29.6c4.1-1.5 8.2-2 13.7-2.2.5 0 1-.5 1-1V7.9H47V33.7zM48.8 41.7c0-1.8-1.5-3.3-3.3-3.3h-4.6H10.7c0 0 0 0 0 0-.4 0-.9.3-9.1 4.4-.7.4-.7 1.4 0 1.8 9.2 4.4 8.7 4.4 9.1 4.4 0 0 0 0 0 0l0 0 0 0c8.8 0 26 0 34.8 0 1.8 0 3.3-1.5 3.3-3.3V41.7zM39.9 40.4v2.3H11.7v-2.3H39.9zM9.7 41v5.3l-5.4-2.7L9.7 41zM11.7 44.6h28.2v2.3H11.7V44.6zM46.8 45.6c0 .7-.6 1.3-1.3 1.3h-3.6v-6.5h3.6c.7 0 1.3.6 1.3 1.3V45.6z"></path>
                                    </svg>
                                    Конспекты
                                </ActionButton>
                                <div className="plan-form__actions-wrapper">
                                    <ActionButton
                                        className="plan-form__action-button"
                                        disabled={isSubmitting || isDisabled}
                                        type="submit"
                                        colorType="success"
                                    >
                                        Сохранить
                                    </ActionButton>
                                    <ActionButton
                                        className="plan-form__action-button"
                                        disabled={isSubmitting || isDisabled}
                                        onClick={moveToConfrim}
                                        type="button"
                                        colorType="danger"
                                    >
                                        Удалить
                                    </ActionButton>
                                </div>
                            </>
                        ) : (
                            <ActionButton
                                className="plan-form__add-button"
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

export default PlanForm;
