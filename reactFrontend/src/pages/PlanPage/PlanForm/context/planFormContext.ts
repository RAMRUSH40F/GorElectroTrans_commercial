import { MouseEvent, createContext, useContext } from "react";

import { FormikContextType } from "formik";

import { IPlan, PLAN_STATUS } from "models/Plan";

import { PlanFormValues } from "..";
import { StatusDropdownOption } from "../constants";

export interface PlanFormManageState {
    initialValues: PlanFormValues;
    initialDate: Date;
    plan?: IPlan;
    isDisabled?: boolean;
    isEditing?: boolean;
    isDateChanged: boolean;
}

export interface PlanFormActions {
    onSubmit: (values: PlanFormValues) => Promise<void>;
    clearError?: () => void;
    getStatusOptionByValue: (
        status: PLAN_STATUS,
    ) => StatusDropdownOption | null;
    checkShouldWriteComment: (status: PLAN_STATUS) => boolean;
    handleMoveToConfirm: (event: MouseEvent<HTMLButtonElement>) => void;
    handleOpenMaterials: (
        event: MouseEvent<HTMLButtonElement>,
        fileNames: string[],
        lessonId: number,
    ) => void;
    setIsDateChanged: (isDateChanged: boolean) => void;
}

export interface PlanFormContextState {
    state: PlanFormManageState;
    actions: PlanFormActions;
    form: FormikContextType<PlanFormValues>;
}

export const PlanFormContext = createContext<PlanFormContextState | null>(null);

export const usePlanFormContext = () => {
    const context = useContext(PlanFormContext);

    if (!context) {
        throw new Error(
            "Plan form context must be used within PlanFormProvider",
        );
    }

    return context;
};
