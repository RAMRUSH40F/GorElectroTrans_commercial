import { FC } from "react";

import { FormErrorMessage, InputNumber, Label } from "components/formElements";

import { usePlanFormContext } from "../context";

interface EmployeesAmountProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const EmployeesAmount: FC<EmployeesAmountProps> = ({
    fieldClassName,
    labelClassName,
}) => {
    const {
        form: { values, errors, touched, handleChange, handleBlur },
        state: { isDisabled },
    } = usePlanFormContext();

    return (
        <Label className={labelClassName} text="Кол-во людей">
            <InputNumber
                className={fieldClassName}
                name="peoplePlanned"
                onBlur={handleBlur}
                onChange={handleChange}
                value={values.peoplePlanned}
                disabled={isDisabled}
                placeholder="Количество"
                allowLeadingZeros={false}
                decimalScale={0}
                allowNegative={false}
                autoComplete="none"
            />
            {errors.peoplePlanned && touched.peoplePlanned && (
                <FormErrorMessage>{errors.peoplePlanned}</FormErrorMessage>
            )}
        </Label>
    );
};
