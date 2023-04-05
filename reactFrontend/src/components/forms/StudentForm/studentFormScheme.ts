import * as yup from "yup";

export const studentFormScheme = yup.object().shape({
    studentId: yup.string().required("Обязательное поле").length(5, "Введите 5-значное значение"),
    subdepartmentName: yup.string().required("Обязательное поле"),
});
