import { FC, MouseEvent, PropsWithChildren, useState } from "react";

import { useFormik } from "formik";

import { movedToConfirm } from "pages/PlanPage/EditPlan/model";
import { modalOpened } from "pages/PlanPage/Materials/model";

import { DropdownOption } from "components/formElements/Dropdown";

import { IPlan, PLAN_STATUS } from "models/Plan";

import { PlanFormValues } from "..";
import {
    StatusDropdownOption,
    statusOptions,
    teacherOptions,
} from "../constants";
import { planFormScheme } from "../planFormScheme";

import {
    PlanFormActions,
    PlanFormContext,
    PlanFormManageState,
} from "./planFormContext";

interface PlanFormProviderProps {
    plan?: IPlan;
    onSubmit: (values: PlanFormValues) => Promise<void>;
    clearError?: () => void;
    isDisabled?: boolean;
    isEditing?: boolean;
}

export const PlanFormProvider: FC<PropsWithChildren<PlanFormProviderProps>> = ({
    onSubmit,
    clearError,
    isDisabled,
    isEditing,
    plan,
    children,
}) => {
    const [isDateChanged, setIsDateChanged] = useState(false);

    const initialDate = plan?.date ? new Date(plan.date) : new Date();

    const getInitialTeacherPostOption = (): DropdownOption => {
        if (plan) {
            return (
                teacherOptions.find(
                    (option) => option.label === String(plan.teacherPost),
                ) ?? teacherOptions[0]
            );
        }
        return teacherOptions[0];
    };

    const getStatusOptionByValue = (status: PLAN_STATUS) => {
        return statusOptions.find((option) => option.value === status) ?? null;
    };

    const getInitialStatusOption = (): StatusDropdownOption => {
        if (plan) {
            return getStatusOptionByValue(plan.status) ?? statusOptions[0];
        }

        return statusOptions[0];
    };

    const initialValues: PlanFormValues = {
        date: initialDate.toISOString(),
        duration: plan?.duration ? String(plan.duration) : "1",
        peoplePlanned: plan?.peoplePlanned ? String(plan.peoplePlanned) : "10",
        teacher: plan?.teacher ?? "",
        topic: plan?.topic ?? "",
        teacherPost: getInitialTeacherPostOption(),
        status: getInitialStatusOption(),
        comment: plan?.comment ?? null,
    };

    const handleOpenMaterials = (
        event: MouseEvent<HTMLButtonElement>,
        fileNames: string[],
        lessonId: number,
    ) => {
        event.stopPropagation();
        modalOpened({ fileNames, lessonId });
    };

    const handleMoveToConfirm = (event: MouseEvent<HTMLButtonElement>) => {
        event.stopPropagation();
        movedToConfirm();
    };

    const checkShouldWriteComment = (status: PLAN_STATUS) =>
        [
            PLAN_STATUS.RESCHEDULED,
            PLAN_STATUS.CANCELLED,
            PLAN_STATUS.PLANNED,
        ].some((value) => value === status);

    const form = useFormik<PlanFormValues>({
        initialValues,
        onSubmit: onSubmit,
        validationSchema: planFormScheme,
    });

    const state: PlanFormManageState = {
        initialValues,
        initialDate,
        isDisabled: isDisabled || form.isSubmitting,
        isEditing,
        plan,
        isDateChanged,
    };

    const actions: PlanFormActions = {
        onSubmit,
        clearError,
        checkShouldWriteComment,
        handleMoveToConfirm,
        handleOpenMaterials,
        getStatusOptionByValue,
        setIsDateChanged,
    };

    return (
        <PlanFormContext.Provider value={{ actions, form, state }}>
            {children}
        </PlanFormContext.Provider>
    );
};
