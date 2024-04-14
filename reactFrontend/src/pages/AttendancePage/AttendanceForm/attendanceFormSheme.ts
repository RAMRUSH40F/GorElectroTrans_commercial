import * as yup from "yup";

export const attendanceFormScheme = yup.object().shape({
    lessonId: yup.string().required("Обязательное поле"),
    studentId: yup
        .string()
        .required("Обязательное поле")
        .length(5, "Введите 5-значное значение"),
});
