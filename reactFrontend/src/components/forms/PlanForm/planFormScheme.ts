import * as yup from "yup";

export const planFormScheme = yup.object().shape({
    topic: yup.string().required("Обязательное поле"),
    duration: yup.number().required("Обязательное поле"),
    peoplePlanned: yup.number().required("Обязательное поле"),
    date: yup.string().required("Обязательное поле"),
    teacher: yup.string().required("Обязательное поле"),
});
