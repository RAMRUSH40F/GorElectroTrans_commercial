import { FC, useRef, useState } from "react";

import cn from "classnames";
import { useFormikContext } from "formik";
import { Popover } from "react-tiny-popover";

import FormErrorMessage from "components/formElements/FormErrorMessage";
import InputNumber from "components/formElements/InputNumber";
import Label from "components/formElements/Label";

import useFocus from "hooks/useFocus";

import { AttendanceFormState } from "../..";

import { EmployeeSearch } from "./EmployeeSearch";

import styles from "./studentId.module.scss";

export const StudentId: FC = () => {
    const {
        isSubmitting,
        values,
        errors,
        touched,
        handleChange,
        handleBlur,
        setFieldValue,
    } = useFormikContext<AttendanceFormState>();

    const isValidationError = errors.studentId && touched.studentId;

    const studentIdRef = useRef<HTMLInputElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useFocus(studentIdRef, true);

    const [isPopoverOpen, setIsPopoverOpen] = useState(false);

    const handleSelectEmployee = (employeeId: string) => {
        setFieldValue("studentId", employeeId);
        setIsPopoverOpen(false);
    };

    return (
        <div ref={containerRef} onClick={(event) => event.stopPropagation()}>
            <Popover
                containerClassName={cn(
                    styles.popover,
                    isValidationError && styles.transform,
                )}
                isOpen={isPopoverOpen}
                positions={["bottom", "top"]}
                reposition={false}
                clickOutsideCapture={true}
                onClickOutside={() => setIsPopoverOpen(false)}
                content={<EmployeeSearch onSelect={handleSelectEmployee} />}
            >
                <Label className={styles.label} text="Табельный номер">
                    <InputNumber
                        className={styles.input}
                        getInputRef={studentIdRef}
                        placeholder="Номер"
                        name="studentId"
                        onFocus={() => setIsPopoverOpen(true)}
                        onBlur={handleBlur}
                        onChange={handleChange}
                        value={values.studentId}
                        disabled={isSubmitting}
                        autoComplete="none"
                        allowNegative={false}
                        allowLeadingZeros={true}
                        maxLength={5}
                        decimalScale={0}
                    />
                    {isValidationError && !isPopoverOpen && (
                        <FormErrorMessage>{errors.studentId}</FormErrorMessage>
                    )}
                </Label>
            </Popover>
        </div>
    );
};
