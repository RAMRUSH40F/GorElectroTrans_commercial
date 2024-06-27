import * as yup from "yup";

const DAY_MS = 24 * 60 * 60 * 1000;

export const dateValidationSchema = yup.object().shape({
    startDate: yup
        .date()
        .required("Обязательное поле")
        .max(new Date(new Date().getTime() + DAY_MS), "Дата еще не наступила")
        .typeError("Некорректная дата"),
    endDate: yup
        .date()
        .required("Обязательное поле")
        .min(yup.ref("startDate"), "Выберите дату позже начала")
        .typeError("Некорректная дата"),
});
