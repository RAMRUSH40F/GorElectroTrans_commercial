import * as yup from "yup";
import { PlanFormValues } from ".";

export const planFormScheme = yup.object<PlanFormValues>().shape({
    topic: yup.string().required("Обязательное поле").trim(),
    duration: yup.number().required("Обязательное поле").min(0.1, "Минимум 0.1"),
    peoplePlanned: yup.number().required("Обязательное поле").min(1, "Минимум 1"),
    date: yup.string().required("Обязательное поле").trim(),
    teacher: yup.string().required("Обязательное поле").trim(),
});
