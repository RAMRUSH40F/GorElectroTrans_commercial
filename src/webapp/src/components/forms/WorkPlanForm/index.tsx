import React from "react";
import useFocus from "../../../hooks/useFocus";
import Input from "../../formElements/Input";
import Label from "../../formElements/Label";
import Textarea from "../../formElements/Textarea";

import "./styles.scss";

const WorkPlanForm: React.FC = () => {
    const textareaRef = React.useRef<HTMLTextAreaElement | null>(null);

    useFocus(textareaRef, true);

    return (
        <form className="work-plan-form">
            <Label className="work-plan-form__label work-plan-form__label--mb" text="Тема занятия">
                <Textarea ref={textareaRef} className="work-plan-form__textarea" placeholder="Тема" />
            </Label>
            <div className="work-plan-form__row">
                <Label className="work-plan-form__label" text="Длительность/ч.">
                    <Input className="work-plan-form__input" placeholder="Длительность" type="number" />
                </Label>
                <Label className="work-plan-form__label" text="Кол-во людей">
                    <Input className="work-plan-form__input" placeholder="Количество" type="number" />
                </Label>
                <Label className="work-plan-form__label" text="Дата">
                    <Input className="work-plan-form__input" type="date" />
                </Label>
            </div>
            <Label className="work-plan-form__label" text="Преподаватель">
                <Input className="work-plan-form__input" placeholder="ФИО" />
            </Label>
        </form>
    );
};

export default WorkPlanForm;
