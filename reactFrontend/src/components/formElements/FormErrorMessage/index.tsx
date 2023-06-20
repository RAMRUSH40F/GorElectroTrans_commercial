import React from "react";
import cn from "classnames";

import styles from "./styles.module.scss";

type Props = {
    children: React.ReactNode;
    className?: string;
};

const FormErrorMessage: React.FC<Props> = ({ children, className }) => {
    return <p className={cn(styles.message, className)}>{children}</p>;
};

export default FormErrorMessage;
