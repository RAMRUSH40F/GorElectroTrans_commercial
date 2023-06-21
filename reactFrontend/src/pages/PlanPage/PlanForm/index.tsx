import React, { FC, useRef, useState, MouseEvent } from "react";
import useFocus from "hooks/useFocus";
import { IPlan, PLAN_STATUS, PLAN_STATUS_VALUE } from "models/Plan";
import Input from "components/formElements/Input";
import Label from "components/formElements/Label";
import Textarea from "components/formElements/Textarea";
import DateInput from "components/formElements/DateInput";
import { Formik } from "formik";
import ActionButton from "components/buttons/ActionButton";
import { planFormScheme } from "./planFormScheme";
import FormErrorMessage from "components/formElements/FormErrorMessage";
import InputNumber from "components/formElements/InputNumber";
import Dropdown, { DropdownOption } from "components/formElements/Dropdown";
import { modalOpened } from "pages/PlanPage/Materials/model";
import { movedToConfirm } from "../EditPlan/model";
import cn from "classnames";

import styles from "./styles.module.scss";

const teacherOptions: DropdownOption[] = [
    { label: "Руководитель/зам.руководителя", value: "post-1" },
    { label: "Ст. мастер/мастер", value: "post-2" },
    { label: "Наставник", value: "post-3" },
    { label: "Cпециалист по техническому обучению", value: "post-4" },
    { label: "Другое", value: "post-5" },
];
const statusOptions: DropdownOption[] = [
    {
        label: PLAN_STATUS_VALUE[PLAN_STATUS.SCHEDULED],
        value: String(PLAN_STATUS.SCHEDULED),
    },
    {
        label: PLAN_STATUS_VALUE[PLAN_STATUS.HELD],
        value: String(PLAN_STATUS.HELD),
    },
];

type Props = {
    onSubmit: (values: PlanFormValues) => Promise<void>;
    clearError?: () => void;
    plan?: IPlan;
    isDisabled?: boolean;
    isEditing?: boolean;
};

export type PlanFormValues = {
    date: string;
    duration: string;
    peoplePlanned: string;
    teacher: string;
    topic: string;
    teacherPost: DropdownOption;
    status: DropdownOption;
};

const PlanForm: FC<Props> = ({
    onSubmit,
    plan,
    isDisabled,
    isEditing,
    clearError,
}) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useFocus(textareaRef, true);

    const initialDate = plan?.date ? new Date(plan.date) : new Date();
    const [date, setDate] = useState<Date | null>(initialDate);

    const getInitialTeacherPostOption = (): DropdownOption => {
        if (plan) {
            return (
                teacherOptions.find(
                    (option) => option.label === String(plan.teacherPost)
                ) ?? teacherOptions[0]
            );
        }
        return teacherOptions[0];
    };

    const getInitialStatusOption = (): DropdownOption => {
        if (plan) {
            return (
                statusOptions.find(
                    (option) => !!parseInt(option.value) === plan.isHeld
                ) ?? statusOptions[0]
            );
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

    const handleOpenMaterials = (
        event: MouseEvent<HTMLButtonElement>,
        fileNames: string[],
        lessonId: number
    ) => {
        event.stopPropagation();
        modalOpened({ fileNames, lessonId });
    };

    const handleMoveToConfirm = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        movedToConfirm();
    };

    return (
        <Formik
            initialValues={initialState}
            onSubmit={onSubmit}
            validationSchema={planFormScheme}
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
                    className="plan-form"
                    onChange={clearError}
                >
                    <Label
                        className={cn(styles.label, styles.mb)}
                        text="Тема занятия"
                    >
                        <Textarea
                            className={styles.textarea}
                            ref={textareaRef}
                            name="topic"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.topic}
                            disabled={isSubmitting || isDisabled}
                            placeholder="Тема"
                        />
                        {errors.topic && touched.topic && (
                            <FormErrorMessage>{errors.topic}</FormErrorMessage>
                        )}
                    </Label>
                    <div className={cn(styles.row, styles.mb)}>
                        <Label className={styles.label} text="Дата">
                            <DateInput
                                className={styles.input}
                                name="date"
                                onChange={(date, event) => {
                                    event?.preventDefault();
                                    event?.stopPropagation();
                                    setDate(date);
                                    setFieldValue("date", date?.toISOString());
                                    clearError && clearError();
                                }}
                                selected={date}
                                disabled={isSubmitting || isDisabled}
                                autoComplete="none"
                                shouldCloseOnSelect={true}
                            />
                            {errors.date && touched.date && (
                                <FormErrorMessage>
                                    {errors.date}
                                </FormErrorMessage>
                            )}
                        </Label>
                        <Label className={styles.label} text="Длительность/ч.">
                            <InputNumber
                                className={styles.input}
                                name="duration"
                                onBlur={handleBlur}
                                onChange={handleChange}
                                value={values.duration}
                                disabled={isSubmitting || isDisabled}
                                placeholder="Длительность"
                                decimalScale={1}
                                allowNegative={false}
                                autoComplete="none"
                            />
                            {errors.duration && touched.duration && (
                                <FormErrorMessage>
                                    {errors.duration}
                                </FormErrorMessage>
                            )}
                        </Label>
                        <Label className={styles.label} text="Кол-во людей">
                            <InputNumber
                                className={styles.input}
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
                                <FormErrorMessage>
                                    {errors.peoplePlanned}
                                </FormErrorMessage>
                            )}
                        </Label>
                    </div>
                    <Label
                        className={cn(styles.label, styles.mb)}
                        text="ФИО преподавателя (полностью)"
                    >
                        <Input
                            className={styles.input}
                            name="teacher"
                            onBlur={handleBlur}
                            onChange={handleChange}
                            value={values.teacher}
                            disabled={isSubmitting || isDisabled}
                            placeholder="ФИО"
                            autoComplete="none"
                        />
                        {errors.teacher && touched.teacher && (
                            <FormErrorMessage>
                                {errors.teacher}
                            </FormErrorMessage>
                        )}
                    </Label>
                    <Label
                        className={cn(styles.label, styles.mb)}
                        text="Должность преподавателя"
                    >
                        <Dropdown
                            options={teacherOptions}
                            initialOption={values.teacherPost}
                            onChange={(option) => {
                                setFieldValue("teacherPost", option);
                                clearError && clearError();
                            }}
                            disabled={isSubmitting || isDisabled}
                        />
                    </Label>
                    {isEditing && (
                        <Label className={styles.label} text="Статус занятия">
                            <Dropdown
                                options={statusOptions}
                                initialOption={values.status}
                                onChange={(option) => {
                                    setFieldValue("status", option);
                                    clearError && clearError();
                                }}
                                disabled={isSubmitting || isDisabled}
                            />
                        </Label>
                    )}
                    <div className={styles.controls}>
                        {plan ? (
                            <>
                                <ActionButton
                                    className={cn(
                                        styles.actionBtn,
                                        styles.materials
                                    )}
                                    onClick={(event) =>
                                        handleOpenMaterials(
                                            event,
                                            plan.lessonContent,
                                            plan.id
                                        )
                                    }
                                    disabled={isSubmitting || isDisabled}
                                    type="button"
                                    colorType="info"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        enableBackground="new 0 0 50 50"
                                        viewBox="0 0 50 50"
                                        id="workbook"
                                    >
                                        <path d="M47.2 5.9h-2.9V4.4c0-.4-.2-.7-.5-.9C38 .4 30.8.3 25 3.3c-5.8-3-13-2.9-18.7.2C5.9 3.7 5.7 4 5.7 4.4v1.5H2.8C1.8 5.9 1 6.7 1 7.7v26.2c0 1 .8 1.8 1.8 1.8 9.8 0 18.5 0 44.3 0 1 0 1.8-.8 1.8-1.8V7.7C49 6.7 48.2 5.9 47.2 5.9zM42.3 5v1.9c0 0 0 0 0 0s0 0 0 0v22.6C35.8 29.9 31 30.6 26 33.1V5C31 2.5 37.2 2.5 42.3 5zM7.7 5C12.8 2.5 19 2.5 24 5v28.1c-5-2.4-9.8-3.2-16.3-3.6V5zM3 7.9h2.7v22.6c0 .5.4 1 1 1 5.5.3 9.7.8 13.7 2.2H3V7.9zM47 33.7H29.6c4.1-1.5 8.2-2 13.7-2.2.5 0 1-.5 1-1V7.9H47V33.7zM48.8 41.7c0-1.8-1.5-3.3-3.3-3.3h-4.6H10.7c0 0 0 0 0 0-.4 0-.9.3-9.1 4.4-.7.4-.7 1.4 0 1.8 9.2 4.4 8.7 4.4 9.1 4.4 0 0 0 0 0 0l0 0 0 0c8.8 0 26 0 34.8 0 1.8 0 3.3-1.5 3.3-3.3V41.7zM39.9 40.4v2.3H11.7v-2.3H39.9zM9.7 41v5.3l-5.4-2.7L9.7 41zM11.7 44.6h28.2v2.3H11.7V44.6zM46.8 45.6c0 .7-.6 1.3-1.3 1.3h-3.6v-6.5h3.6c.7 0 1.3.6 1.3 1.3V45.6z"></path>
                                    </svg>
                                    Конспекты
                                </ActionButton>
                                <div className={styles.controlsWrapper}>
                                    <ActionButton
                                        className={styles.actionBtn}
                                        disabled={isSubmitting || isDisabled}
                                        type="submit"
                                        colorType="success"
                                    >
                                        Сохранить
                                    </ActionButton>
                                    <ActionButton
                                        className={styles.actionBtn}
                                        disabled={isSubmitting || isDisabled}
                                        onClick={handleMoveToConfirm}
                                        type="button"
                                        colorType="danger"
                                    >
                                        Удалить
                                    </ActionButton>
                                </div>
                            </>
                        ) : (
                            <ActionButton
                                className={styles.actionBtn}
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
