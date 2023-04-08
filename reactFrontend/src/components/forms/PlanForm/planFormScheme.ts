import * as yup from "yup";
import { PlanFormValues } from ".";

export const planFormScheme = yup.object<PlanFormValues>().shape({
    topic: yup.string().required("Обязательное поле").trim(),
    duration: yup.number().required("Обязательное поле"),
    peoplePlanned: yup.number().required("Обязательное поле"),
    date: yup.string().required("Обязательное поле").trim(),
    teacher: yup.string().required("Обязательное поле").trim(),
});
