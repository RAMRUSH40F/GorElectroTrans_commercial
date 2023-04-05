import * as yup from "yup";

export const materialFormScheme = yup.object().shape({
    lessonId: yup.string().required("Обязательно поле"),
    file: yup.mixed().required("Выберите файл"),
});
