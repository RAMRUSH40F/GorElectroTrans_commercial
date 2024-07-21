import { FC, SyntheticEvent, useState } from "react";

import { DateInput, FormErrorMessage, Label } from "components/formElements";

import { isDatesDayEqual } from "helpers/isDatesDayEqual";

import { PLAN_STATUS } from "models/Plan";

import { usePlanFormContext } from "../context";

interface DateProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const Date: FC<DateProps> = ({ fieldClassName, labelClassName }) => {
    const {
        form: { errors, touched, setFieldValue, initialValues },
        state: { isDisabled, initialDate, isEditing },
        actions: { clearError, getStatusOptionByValue, setIsDateChanged },
    } = usePlanFormContext();

    const [date, setDate] = useState<Date | null>(initialDate);

    const handleDateChange = (
        fieldDate: Date | null,
        event: SyntheticEvent,
    ) => {
        event?.preventDefault();
        event?.stopPropagation();
        setDate(fieldDate);
        setFieldValue("date", fieldDate?.toISOString());
        clearError?.();

        if (fieldDate && isEditing) {
            if (isDatesDayEqual(fieldDate, initialDate)) {
                setFieldValue("status", initialValues.status);
                setIsDateChanged(false);
            } else {
                const option = getStatusOptionByValue(PLAN_STATUS.RESCHEDULED);

                if (option) {
                    setFieldValue("status", option);
                    setIsDateChanged(true);
                }
            }
        }
    };

    return (
        <Label className={labelClassName} text="Дата">
            <DateInput
                className={fieldClassName}
                name="date"
                onChange={handleDateChange}
                selected={date}
                disabled={isDisabled}
                autoComplete="none"
                shouldCloseOnSelect={true}
            />
            {errors.date && touched.date && (
                <FormErrorMessage>{errors.date}</FormErrorMessage>
            )}
        </Label>
    );
};
