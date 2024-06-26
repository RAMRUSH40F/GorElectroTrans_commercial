import * as yup from "yup";

export const dateValidationSchema = yup.object().shape({
    startDate: yup
        .date()
        .required("Обязательное поле")
        .max(new Date(), "Дата еще не наступила")
        .typeError("Некорректная дата"),
    endDate: yup
        .date()
        .required("Обязательное поле")
        .min(yup.ref("startDate"), "Выберите дату позже начала")
        .typeError("Некорректная дата"),
});