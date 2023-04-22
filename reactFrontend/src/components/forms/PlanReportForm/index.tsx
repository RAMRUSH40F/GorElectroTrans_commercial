import React, { useState } from "react";
import Label from "../../formElements/Label";
import Select from "../../formElements/Select";
import { Option } from "react-dropdown";
import ActionButton from "../../buttons/ActionButton";

import "./styles.scss";

type Props = {
    options: Option[];
    handleSubmit: (event: React.FormEvent<HTMLFormElement>, quarter: string) => Promise<void>;
    isSubmitting: boolean;
};

const PlanReportForm: React.FC<Props> = ({ options, handleSubmit, isSubmitting }) => {
    const [option, setOption] = useState(options[0]);

    return (
        <form className="plan-report-form" onSubmit={(event) => handleSubmit(event, option.value)}>
            <Label className="plan-report-form__label">
                <Select
                    className="plan-report-form__select"
                    controlClassName="plan-report-form__select-control"
                    placeholderClassName="plan-report-form__select-placeholder"
                    options={options}
                    value={option}
                    onChange={(option) => setOption(option)}
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
