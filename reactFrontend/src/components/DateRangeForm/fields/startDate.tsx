import React from "react";

import { useFormikContext } from "formik";

import { DateInput, FormErrorMessage, Label } from "components/formElements";

import { DateRangeFormState } from "../types";

import styles from "./styles.module.scss";

export const StartDate = () => {
    const { values, errors, isSubmitting, setFieldValue } =
        useFormikContext<DateRangeFormState>();

    const handleDateChange = (
        date: Date | null,
        event?: React.SyntheticEvent,
    ) => {
        event?.preventDefault();
        event?.stopPropagation();
        setFieldValue("startDate", date);
    };

    return (
        <Label text="Начало периода">
            <DateInput
                className={styles.dateInput}
                name="startDate"
                onChange={handleDateChange}
                selected={values.startDate}
                disabled={isSubmitting}
                autoComplete="none"
                shouldCloseOnSelect={true}
            />
            {errors.startDate && (
                <FormErrorMessage>
                    {errors.startDate as string}
                </FormErrorMessage>
            )}
        </Label>
    );
};
