import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
    wrapperClassName?: string;
    labelText?: string;
    labelTextClassName?: string;
}

const Checkbox: React.FC<Props> = ({
    wrapperClassName,
    labelText,
    labelTextClassName,
    checked,
    ...rest
}) => {
    return (
        <label className={cn(styles.checkbox, wrapperClassName)}>
            <input className="visually-hidden" type="checkbox" {...rest} />
            <span
                className={cn(styles.field, checked && styles.checked)}
            ></span>
            {labelText && (
                <span className={cn(styles.text, labelTextClassName)}>
                    {labelText}
                </span>
            )}
        </label>
    );
};

export default Checkbox;
