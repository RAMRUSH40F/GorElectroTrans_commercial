import { FC } from "react";

import { FormErrorMessage, Input, Label } from "components/formElements";

import { usePlanFormContext } from "../context";

interface NameProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const Name: FC<NameProps> = ({ fieldClassName, labelClassName }) => {
    const {
        form: { values, errors, touched, handleChange, handleBlur },
        state: { isDisabled },
    } = usePlanFormContext();

    return (
        <Label className={labelClassName} text="ФИО преподавателя (полностью)">
            <Input
                className={fieldClassName}
                name="teacher"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.teacher}
                disabled={isDisabled}
                placeholder="ФИО"
                autoComplete="none"
            />
            {errors.teacher && touched.teacher && (
                <FormErrorMessage>{errors.teacher}</FormErrorMessage>
            )}
        </Label>
    );
};
