import { LoginFormState } from ".";
import * as yup from "yup";

export const loginFormScheme = yup.object<LoginFormState>().shape({
    username: yup.string().required("Обязательное поле").trim(),
    password: yup
        .string()
        .required("Обязательное поле")
        .min(5, "Минимальная длина: 5"),
});
