import React, { FC, useRef } from "react";

import { FormErrorMessage, Label, Textarea } from "components/formElements";

import useFocus from "hooks/useFocus";

import { usePlanFormContext } from "../context";

interface TopicProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const Topic: FC<TopicProps> = ({ fieldClassName, labelClassName }) => {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);
    useFocus(textareaRef, true);

    const {
        form: { errors, touched, handleBlur, handleChange, values },
        state: { isDisabled },
    } = usePlanFormContext();

    return (
        <Label className={labelClassName} text="Тема занятия">
            <Textarea
                className={fieldClassName}
                ref={textareaRef}
                name="topic"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.topic}
                disabled={isDisabled}
                placeholder="Тема"
            />
            {errors.topic && touched.topic && (
                <FormErrorMessage>{errors.topic}</FormErrorMessage>
            )}
        </Label>
    );
};
