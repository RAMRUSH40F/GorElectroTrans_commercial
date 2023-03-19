import React from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import DropDown from "react-dropdown";

import "react-dropdown/style.css";
import "./styles.scss";

const options = ["Зачет", "Незачет"];

const AttendanceForm: React.FC = () => {
    return (
        <form className="attendance-form">
            <Label className="attendance-form__label" text="Табельный номер">
                <Input className="attendance-form__input" placeholder="Табельный номер" />
            </Label>
            <Label className="attendance-form__label" text="Номер занятия">
                <Input className="attendance-form__input" placeholder="Номер занятия" />
            </Label>
            <Label className="attendance-form__label" text="Номер занятия">
                <DropDown className="attendance-form__select" options={options} value={options[0]} />
            </Label>
        </form>
    );
};

export default AttendanceForm;
