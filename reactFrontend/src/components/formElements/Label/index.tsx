import React from "react";
import cn from "classnames";

import "./styles.scss";

interface Props extends React.LabelHTMLAttributes<HTMLLabelElement> {
    text?: string;
}

const Label: React.FC<Props> = ({ children, text, className, ...rest }) => {
    return (
        <label {...rest} className={cn("label", className)}>
            {text && <p className="label__text">{text}</p>}
            {children}
        </label>
    );
};

export default Label;
