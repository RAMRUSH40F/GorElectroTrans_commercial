import React from "react";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import DropDown from "react-dropdown";

import "react-dropdown/style.css";
import "./styles.scss";

const options = ["Водитель", "Слесарь"];

const StudentForm: React.FC = () => {
    return (
        <form className="student-form">
            <Label className="student-form__label" text="ФИО">
                <Input className="student-form__input" placeholder="ФИО" />
            </Label>
            <Label className="student-form__label" text="Отдел">
                <DropDown className="student-form__select" options={options} value={options[0]} />
            </Label>
        </form>
    );
};

export default StudentForm;
