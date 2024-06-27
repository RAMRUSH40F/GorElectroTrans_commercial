import React, { forwardRef } from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text?: string;
}

const Label = forwardRef<HTMLLabelElement, Props>(
    ({ children, text, className, ...rest }, ref) => {
        return (
            <label {...rest} className={cn(styles.label, className)} ref={ref}>
                {text && <p className={styles.text}>{text}</p>}
                {children}
            </label>
        );
    },
);

export default Label;
