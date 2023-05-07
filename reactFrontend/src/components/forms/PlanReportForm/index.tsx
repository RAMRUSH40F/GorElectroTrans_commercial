import React, { useState } from "react";
import Label from "../../formElements/Label";
import ActionButton from "../../buttons/ActionButton";
import Dropdown, { DropdownOption } from "../../formElements/Dropdown";

import "./styles.scss";

type Props = {
    options: DropdownOption[];
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, quarter: string) => Promise<void>;
    isSubmitting: boolean;
    clearError?: () => void;
};

const PlanReportForm: React.FC<Props> = ({ options, handleSubmit, clearError, isSubmitting }) => {
    const [option, setOption] = useState(options[0]);

    return (
        <form className="plan-report-form" onSubmit={(event) => handleSubmit(event, option.value)}>
            <Label className="plan-report-form__label">
                <Dropdown
                    className="plan-report-form__select"
                    options={options}
                    initialOption={option}
                    onChange={(option) => {
                        setOption(option);
                        clearError && clearError();
                    }}
                    disabled={isSubmitting}
                />
            </Label>
            <div className="plan-report-form__actions">
                <ActionButton
                    className="plan-report-form__btn"
                    type="submit"
                    disabled={isSubmitting}
                    colorType="success"
                >
                    Скачать
                </ActionButton>
            </div>
        </form>
    );
};

export default PlanReportForm;
