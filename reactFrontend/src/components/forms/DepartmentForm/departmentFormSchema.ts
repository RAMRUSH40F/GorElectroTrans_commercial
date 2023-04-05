import * as yup from "yup";

export const departmentFormScheme = yup.object().shape({
    name: yup.string().required("Обязательное поле"),
});
