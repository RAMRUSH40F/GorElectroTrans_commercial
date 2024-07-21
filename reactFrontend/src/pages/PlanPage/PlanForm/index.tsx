import React, { FC } from "react";

import cn from "classnames";

import { DropdownOption } from "components/formElements/Dropdown";

import { IPlan } from "models/Plan";

import { StatusDropdownOption } from "./constants";
import { PlanFormProvider, usePlanFormContext } from "./context";
import {
    AddButton,
    DeleteButton,
    EditButton,
    MaterialsButton,
} from "./controls";
import {
    Comment,
    Date as DateField,
    Duration,
    EmployeesAmount,
    Name,
    Status,
    TeacherPost,
    Topic,
} from "./fields";

import styles from "./styles.module.scss";

type PlanFormProps = {
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
    status: StatusDropdownOption;
    comment: string | null;
};

const PlanFormContent: FC = () => {
    const {
        state: { plan, isEditing },
        form: { handleSubmit },
        actions: { clearError },
    } = usePlanFormContext();

    return (
        <form
            onSubmit={handleSubmit}
            className="plan-form"
            onChange={clearError}
            aria-label="Рабочий план"
        >
            <Topic
                labelClassName={cn(styles.label, styles.mb)}
                fieldClassName={styles.textarea}
            />
            <div className={cn(styles.row, styles.mb)}>
                <DateField
                    fieldClassName={styles.input}
                    labelClassName={styles.label}
                />
                <Duration
                    fieldClassName={styles.input}
                    labelClassName={styles.label}
                />
                <EmployeesAmount
                    fieldClassName={styles.input}
                    labelClassName={styles.label}
                />
            </div>
            <Name
                labelClassName={cn(styles.label, styles.mb)}
                fieldClassName={styles.input}
            />
            <TeacherPost labelClassName={cn(styles.label, styles.mb)} />
            {isEditing && (
                <>
                    <Status className={cn(styles.label, styles.mb)} />
                    <Comment
                        labelClassName={styles.label}
                        fieldClassName={styles.textarea}
                    />
                </>
            )}
            <div className={styles.controls}>
                {plan ? (
                    <>
                        <MaterialsButton
                            className={cn(styles.actionBtn, styles.materials)}
                        />
                        <div className={styles.controlsWrapper}>
                            <EditButton className={styles.actionBtn} />
                            <DeleteButton className={styles.actionBtn} />
                        </div>
                    </>
                ) : (
                    <AddButton className={styles.actionBtn} />
                )}
            </div>
        </form>
    );
};

const PlanForm: FC<PlanFormProps> = ({
    onSubmit,
    clearError,
    isDisabled,
    isEditing,
    plan,
}) => {
    return (
        <PlanFormProvider
            onSubmit={onSubmit}
            plan={plan}
            clearError={clearError}
            isDisabled={isDisabled}
            isEditing={isEditing}
        >
            <PlanFormContent />
        </PlanFormProvider>
    );
};

export default PlanForm;
