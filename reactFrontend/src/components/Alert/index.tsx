import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

export enum ALERT {
    WARNING = "warning",
    SUCCESS = "success",
    ERROR = "error",
    INFO = "info",
}

type Props = {
    children: React.ReactNode;
    type: ALERT;
    className?: string;
};

const Alert: React.FC<Props> = ({ children, type, className }) => {
    return (
        <div className={cn(styles.alert, styles[type], className)}>
            {children}
        </div>
    );
};

export default Alert;
