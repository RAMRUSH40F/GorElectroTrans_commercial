import React from "react";

import cn from "classnames";

import styles from "./styles.module.scss";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(
    ({ className, children, ...rest }, ref) => {
        return (
            <textarea
                {...rest}
                ref={ref}
                className={cn(styles.textarea, className)}
            >
                {children}
            </textarea>
        );
    },
);

export default Textarea;
