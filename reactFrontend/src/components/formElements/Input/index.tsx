import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

type Props = React.InputHTMLAttributes<HTMLInputElement>;

const Input = React.forwardRef<HTMLInputElement, Props>(
    ({ className, ...rest }, ref) => {
        return (
            <input
                {...rest}
                className={cn(styles.input, className)}
                ref={ref}
            />
        );
    },
);

export default Input;
