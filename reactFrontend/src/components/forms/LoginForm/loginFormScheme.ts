import * as yup from "yup";

export const loginFormScheme = yup.object().shape({
    email: yup.string().required("Обязательное поле").email("Неверный формат email"),
    password: yup.string().required("Обязательное поле").min(5, "Минимальная длина: 5"),
});
