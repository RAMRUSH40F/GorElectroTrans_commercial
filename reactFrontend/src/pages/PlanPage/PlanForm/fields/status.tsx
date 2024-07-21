import { FC, useMemo } from "react";

import { Dropdown, Label } from "components/formElements";

import { useRole } from "hooks/useRole";

import { PLAN_STATUS } from "models/Plan";

import { StatusDropdownOption, statusOptions } from "../constants";
import { usePlanFormContext } from "../context";

interface StatusProps {
    className?: string;
}

export const Status: FC<StatusProps> = ({ className }) => {
    const {
        form: {
            values,
            initialValues,
            setFieldValue,
            setFieldError,
            setTouched,
        },
        actions: { checkShouldWriteComment, clearError },
        state: { isDisabled, isDateChanged },
    } = usePlanFormContext();

    const { isAdmin } = useRole();

    const handleStatusChange = (option: StatusDropdownOption) => {
        setFieldValue("status", option);

        if (!checkShouldWriteComment(option.value)) {
            setFieldError("comment", undefined);
            setTouched({ comment: false });
        }
        clearError?.();
    };

    const filteredOptions = useMemo(() => {
        if (isAdmin) return statusOptions;

        if (isDateChanged) {
            return statusOptions.filter(
                (option) => option.value === PLAN_STATUS.RESCHEDULED,
            );
        }

        if (initialValues.status.value !== PLAN_STATUS.PLANNED) {
            return statusOptions.filter(
                (option) => option.value !== PLAN_STATUS.PLANNED,
            );
        }

        return statusOptions;
    }, [initialValues.status.value, isAdmin, isDateChanged]);

    return (
        <Label className={className} text="Статус занятия">
            <Dropdown
                value={values.status}
                options={filteredOptions}
                initialOption={values.status}
                onChange={handleStatusChange}
                disabled={isDisabled}
            />
        </Label>
    );
};
