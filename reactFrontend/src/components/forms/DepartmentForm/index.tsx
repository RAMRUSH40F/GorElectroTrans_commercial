import React from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";

import "./styles.scss";

const DepartmentForm: React.FC = () => {
    return (
        <form className="department-form">
            <Label className="department-form__label" text="Название отдела">
                <Input className="department-form__input" placeholder="Отдел" />
            </Label>
        </form>
    );
};

export default DepartmentForm;
