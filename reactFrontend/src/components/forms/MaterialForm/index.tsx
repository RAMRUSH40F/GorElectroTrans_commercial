import React from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";

import "./styles.scss";

const MaterialForm: React.FC = () => {
    return (
        <form className="student-form">
            <Label className="student-form__label" text="Номер занятия">
                <Input className="student-form__input" placeholder="Номер" type="number" />
            </Label>
            <Label className="student-form__label" text="Отдел">
                <Input className="student-form__input" placeholder="ФИО" type="file" />
            </Label>
        </form>
    );
};

export default MaterialForm;
