import React from "react";

import { Formik } from "formik";

import ActionButton from "components/ActionButton";

import { EndDate, StartDate } from "./fields";
import { dateValidationSchema } from "./formScheme";
import { DateRangeFormState, Props } from "./types";

import styles from "./styles.module.scss";

export const INITIAL_STATE: DateRangeFormState = {
    startDate: new Date(),
    endDate: new Date(),
};

export const DateRangeForm: React.FC<Props> = ({ onSubmit }) => {
    return (
        <Formik
            initialValues={INITIAL_STATE}
            onSubmit={onSubmit}
            validationSchema={dateValidationSchema}
        >
            {({ handleSubmit, isSubmitting }) => (
                <form
                    className={styles.form}
                    onSubmit={handleSubmit}
                    aria-label="Отчетность"
                >
                    <div className={styles.fields}>
                        <StartDate />
                        <EndDate />
                    </div>
                    <div className={styles.controls}>
                        <ActionButton
                            className={styles.submitButton}
                            type="submit"
                            disabled={isSubmitting}
                            colorType="success"
                        >
                            Скачать
                        </ActionButton>
                    </div>
                </form>
            )}
        </Formik>
    );
};
