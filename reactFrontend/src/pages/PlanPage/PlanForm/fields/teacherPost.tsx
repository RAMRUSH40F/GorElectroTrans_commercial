import { FC } from "react";

import { Dropdown, Label } from "components/formElements";

import { teacherOptions } from "../constants";
import { usePlanFormContext } from "../context";

interface TeacherPostProps {
    labelClassName?: string;
    fieldClassName?: string;
}

export const TeacherPost: FC<TeacherPostProps> = ({
    fieldClassName,
    labelClassName,
}) => {
    const {
        form: { values, setFieldValue },
        state: { isDisabled },
        actions: { clearError },
    } = usePlanFormContext();

    return (
        <Label className={labelClassName} text="Должность преподавателя">
            <Dropdown
                className={fieldClassName}
                name="teacher"
                options={teacherOptions}
                initialOption={values.teacherPost}
                onChange={(option) => {
                    setFieldValue("teacherPost", option);
                    clearError?.();
                }}
                disabled={isDisabled}
            />
        </Label>
    );
};
