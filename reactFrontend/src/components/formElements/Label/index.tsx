import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text?: string;
}

const Label: React.FC<Props> = ({ children, text, className, ...rest }) => {
    return (
        <label {...rest} className={cn(styles.label, className)}>
            {text && <p className={styles.text}>{text}</p>}
            {children}
        </label>
    );
};

export default Label;
