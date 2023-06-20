import React from "react";
import { ALERT } from "../../constants/alertTypes";
import cn from "classnames";

import styles from "./styles.module.scss";

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
