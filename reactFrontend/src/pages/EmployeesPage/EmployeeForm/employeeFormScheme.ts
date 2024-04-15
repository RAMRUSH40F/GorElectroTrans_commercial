import * as yup from "yup";

export const employeeFormScheme = yup.object().shape({
    studentId: yup
        .string()
        .required("Обязательное поле")
        .length(5, "Введите 5-значное значение"),
    fullName: yup.string().required("Обязательно поле").trim(),
});
