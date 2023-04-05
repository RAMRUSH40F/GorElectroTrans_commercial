import React from "react";
import cn from "classnames";

import "./styles.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    labelText?: string;
    labelTextClassName?: string;
}

const Checkbox: React.FC<Props> = ({ wrapperClassName, labelText, labelTextClassName, checked, ...rest }) => {
    return (
        <label className={cn("checkbox", wrapperClassName)}>
            <input className="visually-hidden" type="checkbox" {...rest} />
            <span className={cn("checkbox__field", { "checkbox__field--checked": checked })}></span>
            {labelText && <span className={cn("checkbox__label-text", labelTextClassName)}>{labelText}</span>}
        </label>
    );
};

export default Checkbox;
