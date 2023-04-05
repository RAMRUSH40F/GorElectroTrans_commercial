import React from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";

import "./styles.scss";

const PlanReportForm: React.FC = () => {
    return (
        <form className="plan-report-form">
            <Label className="plan-report-form__label" text="С какого">
                <Input className="plan-report-form__input" type="date" />
            </Label>
            <Label className="plan-report-form__label" text="С какого">
                <Input className="plan-report-form__input" type="date" />
            </Label>
        </form>
    );
};

export default PlanReportForm;
