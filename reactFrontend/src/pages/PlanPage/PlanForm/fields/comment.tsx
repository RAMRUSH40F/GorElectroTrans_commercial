import { FC } from "react";

import { FormErrorMessage, Label, Textarea } from "components/formElements";

import { usePlanFormContext } from "../context";

interface CommentProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const Comment: FC<CommentProps> = ({
    fieldClassName,
    labelClassName,
}) => {
    const {
        form: { errors, touched, handleChange, handleBlur, values },
        state: { isDisabled },
    } = usePlanFormContext();

    return (
        <Label className={labelClassName} text="Комментарий">
            <Textarea
                className={fieldClassName}
                name="comment"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.comment ?? ""}
                disabled={isDisabled}
                placeholder="Укажите причину..."
            />
            {errors.comment && touched.comment && (
                <FormErrorMessage>{errors.comment}</FormErrorMessage>
            )}
        </Label>
    );
};
