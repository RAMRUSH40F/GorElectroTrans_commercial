import React from "react";
import cn from "classnames";

import "./styles.scss";

type Props = React.TextareaHTMLAttributes<HTMLTextAreaElement>;

const Textarea = React.forwardRef<HTMLTextAreaElement, Props>(({ className, children, ...rest }, ref) => {
    return (
        <textarea {...rest} ref={ref} className={cn("textarea", className)}>
            {children}
        </textarea>
    );
});

export default Textarea;
