import React from "react";
import cn from "classnames";

import "./styles.scss";

interface Props extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    colorType: "submit" | "delete" | "add";
}

const ActionButton: React.FC<Props> = ({ colorType, className, children, ...rest }) => {
    return (
        <button {...rest} className={cn("action-button", `action-button--${colorType}`, className)}>
            {children}
        </button>
    );
};

export default ActionButton;
