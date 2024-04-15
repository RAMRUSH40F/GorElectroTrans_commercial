import React from "react";

import cn from "classnames";
import ruLocalization from "date-fns/locale/ru";
import DatePicker, {
    ReactDatePickerProps,
    registerLocale,
} from "react-datepicker";

import styles from "./styles.module.scss";
import "react-datepicker/dist/react-datepicker.css";

registerLocale("ru", ruLocalization);

const DateInput: React.FC<ReactDatePickerProps> = ({
    onChange,
    className,
    ...rest
}) => {
    return (
        <DatePicker
            {...rest}
            className={cn(styles.input, className)}
            shouldCloseOnSelect={true}
            onChange={(date, event) => onChange(date, event)}
            dateFormat="dd/MM/yyyy"
            locale={ruLocalization}
        />
    );
};

export default DateInput;
