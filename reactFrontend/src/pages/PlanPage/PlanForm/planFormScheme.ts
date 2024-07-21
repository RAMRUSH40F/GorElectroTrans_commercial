import { PlanFormValues } from ".";
import * as yup from "yup";

import { PLAN_STATUS } from "models/Plan";

import { StatusDropdownOption } from "./constants";

export const planFormScheme = yup.object<PlanFormValues>().shape({
    topic: yup.string().required("Обязательное поле").trim(),
    duration: yup
        .number()
        .required("Обязательное поле")
        .min(0.1, "Минимум 0.1"),
    peoplePlanned: yup
        .number()
        .required("Обязательное поле")
        .min(1, "Минимум 1"),
    date: yup.string().required("Обязательное поле").trim(),
    teacher: yup.string().required("Обязательное поле").trim(),
    comment: yup.string().when("status", {
        is: (value: StatusDropdownOption) =>
            [PLAN_STATUS.RESCHEDULED, PLAN_STATUS.CANCELLED].includes(
                value.value,
            ),
        then: (schema) =>
            schema
                .nonNullable()
                .trim()
                .required("Обязательное поле")
                .min(1, "Обязательное поле"),
        otherwise: (schema) => schema.nullable(),
    }),
});
