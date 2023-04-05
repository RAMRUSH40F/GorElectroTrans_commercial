import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = {
    children: React.ReactNode;
    text?: string;
    className?: string;
};

const Label: React.FC<Props> = ({ children, text, className }) => {
    return (
        <label className={cn("label", className)}>
            {text && <p className="label__text">{text}</p>}
            {children}
        </label>
    );
};

export default Label;
