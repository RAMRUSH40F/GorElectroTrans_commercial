import React from "react";

import { useFormikContext } from "formik";

import { DateInput, FormErrorMessage, Label } from "components/formElements";

import { DateRangeFormState } from "../types";

import styles from "./styles.module.scss";

export const EndDate = () => {
    const { values, errors, isSubmitting, setFieldValue } =
        useFormikContext<DateRangeFormState>();

    const handleDateChange = (
        date: Date | null,
        event?: React.SyntheticEvent,
    ) => {
        event?.preventDefault();
        event?.stopPropagation();
        setFieldValue("endDate", date);
    };

    return (
        <Label text="Конец периода">
            <DateInput
                className={styles.dateInput}
                name="endDate"
                onChange={handleDateChange}
                selected={values.endDate}
                disabled={isSubmitting}
                autoComplete="none"
                shouldCloseOnSelect={true}
            />
            {errors.endDate && (
                <FormErrorMessage>{errors.endDate as string}</FormErrorMessage>
            )}
        </Label>
    );
};
