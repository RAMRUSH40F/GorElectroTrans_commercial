import React from "react";
import DatePicker, { ReactDatePickerProps, registerLocale } from "react-datepicker";
import ruLocalization from "date-fns/locale/ru";
import cn from "classnames";

import "react-datepicker/dist/react-datepicker.css";
import "./styles.scss";

registerLocale("ru", ruLocalization);

const DateInput: React.FC<ReactDatePickerProps> = ({ onChange, className, ...rest }) => {
    return (
        <DatePicker
            {...rest}
            className={cn("date-input", className)}
            shouldCloseOnSelect={true}
            onChange={(date, event) => onChange(date, event)}
            dateFormat="dd/MM/yyyy"
            locale={ruLocalization}
        />
    );
};

export default DateInput;
