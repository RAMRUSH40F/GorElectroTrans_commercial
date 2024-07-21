import { FC } from "react";

import { FormErrorMessage, InputNumber, Label } from "components/formElements";

import { usePlanFormContext } from "../context";

interface DurationProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const Duration: FC<DurationProps> = ({
    fieldClassName,
    labelClassName,
}) => {
    const {
        form: { values, errors, touched, handleChange, handleBlur },
        state: { isDisabled },
    } = usePlanFormContext();

    return (
        <Label className={labelClassName} text="Длительность/ч.">
            <InputNumber
                className={fieldClassName}
                name="duration"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.duration}
                disabled={isDisabled}
                placeholder="Длительность"
                decimalScale={1}
                allowNegative={false}
                autoComplete="none"
            />
            {errors.duration && touched.duration && (
                <FormErrorMessage>{errors.duration}</FormErrorMessage>
            )}
        </Label>
    );
};
