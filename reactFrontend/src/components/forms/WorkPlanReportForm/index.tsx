import React from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";

import "./styles.scss";

const WorkPlanReportForm: React.FC = () => {
    return (
        <form className="work-plan-report-form">
            <Label className="work-plan-report-form__label" text="С какого">
                <Input className="work-plan-report-form__input" type="date" />
            </Label>
            <Label className="work-plan-report-form__label" text="С какого">
                <Input className="work-plan-report-form__input" type="date" />
            </Label>
        </form>
    );
};

export default WorkPlanReportForm;
